package com.mempoolexplorer.backend.services;

import java.time.Instant;

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
		AlgorithmType algorithmUsed = ib.getAlgorithmUsed();

		// Only igBlock whith bitcoind algorithm saves minerNameToBlockHeight to avoid
		// repetitive saves.
		// Only igBlock whith bitcoind algorithm increments block count when saving
		// miner statistics
		if (algorithmUsed == AlgorithmType.BITCOIND) {
			minerNameToBlockHeightRepository.save(
					new MinerNameToBlockHeight(minerName, blockHeight, ib.getMinedBlockData().getMedianMinedTime()))
					.block();
			saveMinerStatistics(minerName, blockHeight, ib.getLostReward(), 0, 1);
			saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, ib.getLostReward(), 0, 1);
		} else {
			saveMinerStatistics(minerName, blockHeight, 0, ib.getLostReward(), 0);
			saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, 0, ib.getLostReward(), 0);
		}
		res.getExecutionInfoList().add("Saved stats for block: " + blockHeight + ", Algorithm: " + algorithmUsed);
	}

	@Override
	public void saveStatisticsToDB(IgnoringBlock iGBlockBitcoind, IgnoringBlock iGBlockOurs) {

		String minerName = iGBlockBitcoind.getMinedBlockData().getCoinBaseData().getMinerName();
		int height = iGBlockBitcoind.getMinedBlockData().getHeight();
		Instant medianMinedTime = iGBlockBitcoind.getMinedBlockData().getMedianMinedTime();

		minerNameToBlockHeightRepository.save(new MinerNameToBlockHeight(minerName, height, medianMinedTime)).block();

		saveMinerStatistics(minerName, height, iGBlockBitcoind.getLostReward(), iGBlockOurs.getLostReward(), 1);

		// SaveGlobalStatistics
		saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, height, iGBlockBitcoind.getLostReward(),
				iGBlockOurs.getLostReward(), 1);

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
			long iGBlockOursLostReward, int add) {
		MinerStatistics minerStatistics = minerStatisticsRepository.findById(minerName).map(ms -> {
			ms.setNumBlocksMined(ms.getNumBlocksMined() + add);
			ms.setTotalLostRewardBT(ms.getTotalLostRewardBT() + iGBlockBitcoindLostReward);
			ms.setTotalLostRewardCB(ms.getTotalLostRewardCB() + iGBlockOursLostReward);
			// Avoid division by 0
			ms.setTotalLostRewardBTPerBlock(ms.getTotalLostRewardBT() / Math.max(ms.getNumBlocksMined(), 1));
			ms.setTotalLostRewardCBPerBlock(ms.getTotalLostRewardCB() / Math.max(ms.getNumBlocksMined(), 1));
			return ms;
		}).defaultIfEmpty(new MinerStatistics(minerName, -1, iGBlockBitcoindLostReward, iGBlockOursLostReward, add,
				iGBlockBitcoindLostReward, iGBlockOursLostReward)).block();

		// Only save if another instance has not done it yet.
		if (minerStatistics != null && minerStatistics.getLastMinedBlock() != blockHeight) {
			minerStatistics.setLastMinedBlock(blockHeight);
			minerStatisticsRepository.save(minerStatistics).block();
		}
	}

}
