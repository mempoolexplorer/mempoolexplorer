package com.mempoolexplorer.backend.services;

import java.time.Instant;
import java.util.HashMap;
import java.util.Optional;

import com.mempoolexplorer.backend.controllers.entities.RecalculateAllStatsResult;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;
import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;
import com.mempoolexplorer.backend.repositories.entities.MinerStatistics;
import com.mempoolexplorer.backend.repositories.reactive.IgBlockReactiveRepository;
import com.mempoolexplorer.backend.repositories.reactive.MinerNameToBlockHeightReactiveRepository;
import com.mempoolexplorer.backend.repositories.reactive.MinerStatisticsReactiveRepository;
import com.mempoolexplorer.backend.utils.SysProps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StatisticsServiceImpl implements StatisticsService {

	@Autowired
	private IgBlockReactiveRepository igBlockReactiveRepository;

	@Autowired
	private MinerStatisticsReactiveRepository minerStatisticsRepository;

	@Autowired
	private MinerNameToBlockHeightReactiveRepository minerNameToBlockHeightRepository;

	private HashMap<Integer, Long> heightToBitcoindLostReward = new HashMap<>();
	private HashMap<Integer, Long> heightToOursLostReward = new HashMap<>();

	@Override
	public RecalculateAllStatsResult recalculateAllStats() {
		RecalculateAllStatsResult res = new RecalculateAllStatsResult();

		minerStatisticsRepository.deleteAll().block();
		res.getExecutionInfoList().add("minerStatisticsRepository.deleteAll() executed.");
		minerNameToBlockHeightRepository.deleteAll().block();
		res.getExecutionInfoList().add("minerNameToBlockHeightRepository.deleteAll() executed.");

		igBlockReactiveRepository.findAll().doOnNext(ib -> saveStatistics(ib, res)).blockLast();

		return res;

	}

	private void saveStatistics(IgnoringBlock ib, RecalculateAllStatsResult res) {
		String minerName = ib.getMinedBlockData().getCoinBaseData().getMinerName();
		int blockHeight = ib.getMinedBlockData().getHeight();
		Optional<Long> opTotalFeesEBR = ib.getMinedBlockData().getFeeableData().getTotalBaseFee();
		AlgorithmType algorithmUsed = ib.getAlgorithmUsed();

		if (algorithmUsed == AlgorithmType.BITCOIND) {
			minerNameToBlockHeightRepository.save(
					new MinerNameToBlockHeight(minerName, blockHeight, ib.getMinedBlockData().getMedianMinedTime()))
					.block();

			Long oursLostReward = heightToOursLostReward.remove(blockHeight);
			if (oursLostReward != null) {
				saveMinerStatistics(minerName, blockHeight, ib.getLostReward(), oursLostReward, opTotalFeesEBR);
				saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, ib.getLostReward(), oursLostReward,
						opTotalFeesEBR);
			} else {
				heightToBitcoindLostReward.put(blockHeight, ib.getLostReward());
			}
		} else {// AlgorithmType.OURS
			Long bitcoindLostReward = heightToBitcoindLostReward.remove(blockHeight);
			if (bitcoindLostReward != null) {
				saveMinerStatistics(minerName, blockHeight, bitcoindLostReward, ib.getLostReward(), opTotalFeesEBR);
				saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, bitcoindLostReward, ib.getLostReward(),
						opTotalFeesEBR);
			} else {
				heightToOursLostReward.put(blockHeight, ib.getLostReward());
			}
		}
		res.getExecutionInfoList().add("Saved stats for block: " + blockHeight + ", Algorithm: " + algorithmUsed);
	}

	@Override
	public void saveStatisticsToDB(IgnoringBlock iGBlockBitcoind, IgnoringBlock iGBlockOurs) {

		String minerName = iGBlockBitcoind.getMinedBlockData().getCoinBaseData().getMinerName();
		int height = iGBlockBitcoind.getMinedBlockData().getHeight();
		Optional<Long> opTotalFeesEBR = iGBlockBitcoind.getMinedBlockData().getFeeableData().getTotalBaseFee();
		Instant medianMinedTime = iGBlockBitcoind.getMinedBlockData().getMedianMinedTime();
		minerNameToBlockHeightRepository.save(new MinerNameToBlockHeight(minerName, height, medianMinedTime)).block();
		saveMinerStatistics(minerName, height, iGBlockBitcoind.getLostReward(), iGBlockOurs.getLostReward(),
				opTotalFeesEBR);
		saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, height, iGBlockBitcoind.getLostReward(),
				iGBlockOurs.getLostReward(), opTotalFeesEBR);

		log.info("Statistics persisted.");
	}

	/**
	 * 
	 * @param minerName
	 * @param iGBlockBitcoindLostReward if any
	 * @param iGBlockOursLostReward     if any
	 * @param add                       this is the amount to add to
	 *                                  ms.setNumBlocksMined, useful when there is
	 *                                  igblocks from different algoritms in db.
	 */
	private void saveMinerStatistics(String minerName, int blockHeight, long iGBlockBitcoindLostReward,
			long iGBlockOursLostReward, Optional<Long> opTotalFeesEBR) {
		MinerStatistics minerStatistics = minerStatisticsRepository.findById(minerName).map(ms -> {
			ms.setNumBlocksMined(ms.getNumBlocksMined() + 1);
			ms.setTotalLostRewardBT(ms.getTotalLostRewardBT() + iGBlockBitcoindLostReward);
			ms.setTotalLostRewardCB(ms.getTotalLostRewardCB() + iGBlockOursLostReward);
			ms.setTotalFeesExcBlockReward(ms.getTotalFeesExcBlockReward() + opTotalFeesEBR.orElse(0L));
			// Avoid division by 0
			ms.setTotalLostRewardBTPerBlock(ms.getTotalLostRewardBT() / Math.max(ms.getNumBlocksMined(), 1));
			ms.setTotalLostRewardCBPerBlock(ms.getTotalLostRewardCB() / Math.max(ms.getNumBlocksMined(), 1));
			ms.setTotalFeesExcBlockRewardPerBlock(ms.getTotalFeesExcBlockReward() / Math.max(ms.getNumBlocksMined(), 1));
			return ms;
		}).defaultIfEmpty(new MinerStatistics(minerName, -1, iGBlockBitcoindLostReward, iGBlockOursLostReward, 1,
				iGBlockBitcoindLostReward, iGBlockOursLostReward, opTotalFeesEBR.orElse(0L), opTotalFeesEBR.orElse(0L)))
				.block();

		// Only save if another instance has not done it yet.
		if (minerStatistics != null && minerStatistics.getLastMinedBlock() != blockHeight) {
			minerStatistics.setLastMinedBlock(blockHeight);
			minerStatisticsRepository.save(minerStatistics).block();
		}
	}

}
