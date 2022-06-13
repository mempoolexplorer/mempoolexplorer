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

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StatisticsServiceImpl implements StatisticsService {

	@Getter
	@Setter
	@AllArgsConstructor
	public class Data {
		private Long lostReward;
		private Optional<Long> ourAlgoFees;
	}

	@Autowired
	private IgBlockReactiveRepository igBlockReactiveRepository;

	@Autowired
	private MinerStatisticsReactiveRepository minerStatisticsRepository;

	@Autowired
	private MinerNameToBlockHeightReactiveRepository minerNameToBlockHeightRepository;

	private HashMap<Integer, Data> heightToGBTData = new HashMap<>();
	private HashMap<Integer, Data> heightToOBAData = new HashMap<>();

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
		boolean empty = isEmpty(ib);

		Optional<Long> opFees = ib.getMinedBlockData().getFeeableData().getTotalBaseFee();
		Optional<Long> opOurAlgoFees = ib.getCandidateBlockData().getFeeableData().getTotalBaseFee();
		Optional<Long> opFeesNotRelayed = ib.getNotRelayedTousData().getTotalBaseFee();

		AlgorithmType algorithmUsed = ib.getAlgorithmUsed();

		if (algorithmUsed == AlgorithmType.BITCOIND) {
			minerNameToBlockHeightRepository.save(
					new MinerNameToBlockHeight(minerName, blockHeight, ib.getMinedBlockData().getMedianMinedTime()))
					.block();

			Data obaData = heightToOBAData.remove(blockHeight);
			if (obaData != null) {
				saveMinerStatistics(minerName, blockHeight, ib.getLostReward(), obaData.getLostReward(), opFees, opFees, empty,
						opFeesNotRelayed);
				saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, ib.getLostReward(), obaData.getLostReward(),
						opFees, opFees, empty, opFeesNotRelayed);
				saveMinerStatistics(SysProps.OUR_MINER_NAME, blockHeight, 0, 0, opOurAlgoFees, obaData.getOurAlgoFees(), empty,
						opFeesNotRelayed);
			} else {
				heightToGBTData.put(blockHeight, new Data(ib.getLostReward(), opOurAlgoFees));
			}
		} else {// AlgorithmType.OURS
			Data gbtData = heightToGBTData.remove(blockHeight);
			if (gbtData != null) {
				saveMinerStatistics(minerName, blockHeight, gbtData.getLostReward(), ib.getLostReward(), opFees, opFees, empty,
						opFeesNotRelayed);
				saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, blockHeight, gbtData.getLostReward(), ib.getLostReward(),
						opFees, opFees, empty, opFeesNotRelayed);
				saveMinerStatistics(SysProps.OUR_MINER_NAME, blockHeight, 0, 0, gbtData.getOurAlgoFees(), opOurAlgoFees, empty,
						opFeesNotRelayed);
			} else {
				heightToOBAData.put(blockHeight, new Data(ib.getLostReward(), opOurAlgoFees));
			}
		}
		res.getExecutionInfoList().add("Saved stats for block: " + blockHeight + ", Algorithm: " + algorithmUsed);
	}

	@Override
	public void saveStatisticsToDB(IgnoringBlock ibGBT, IgnoringBlock ibOBA) {

		String minerName = ibGBT.getMinedBlockData().getCoinBaseData().getMinerName();
		int height = ibGBT.getMinedBlockData().getHeight();
		boolean empty = isEmpty(ibGBT);

		Optional<Long> opFees = ibGBT.getMinedBlockData().getFeeableData().getTotalBaseFee();
		Optional<Long> opFeesGBT = ibGBT.getCandidateBlockData().getFeeableData().getTotalBaseFee();
		Optional<Long> opFeesOBA = ibOBA.getCandidateBlockData().getFeeableData().getTotalBaseFee();
		Optional<Long> opFeesNotRelayed = ibGBT.getNotRelayedTousData().getTotalBaseFee();

		Instant medianMinedTime = ibGBT.getMinedBlockData().getMedianMinedTime();
		minerNameToBlockHeightRepository.save(new MinerNameToBlockHeight(minerName, height, medianMinedTime)).block();

		saveMinerStatistics(minerName, height, ibGBT.getLostReward(), ibOBA.getLostReward(), opFees, opFees, empty,
				opFeesNotRelayed);
		saveMinerStatistics(SysProps.GLOBAL_MINER_NAME, height, ibGBT.getLostReward(), ibOBA.getLostReward(), opFees,
				opFees, empty, opFeesNotRelayed);
		saveMinerStatistics(SysProps.OUR_MINER_NAME, height, 0, 0, opFeesGBT, opFeesOBA, empty, opFeesNotRelayed);

		log.info("Statistics persisted.");
	}

	private void saveMinerStatistics(String minerName, int blockHeight, long lostRewardGBT,
			long lostRewardOBA, Optional<Long> opFeesGBT, Optional<Long> opFeesOBA, boolean isBlockEmpty,
			Optional<Long> opFeesNotRelayed) {

		MinerStatistics minerStatistics = minerStatisticsRepository.findById(minerName).map(ms -> {
			ms.setNumBlocksMined(ms.getNumBlocksMined() + 1);
			ms.setTotalLostRewardGBT(ms.getTotalLostRewardGBT() + lostRewardGBT);
			ms.setTotalLostRewardOBA(ms.getTotalLostRewardOBA() + lostRewardOBA);
			ms.setTotalFeesGBT(ms.getTotalFeesGBT() + opFeesGBT.orElse(0L));
			ms.setTotalFeesOBA(ms.getTotalFeesOBA() + opFeesOBA.orElse(0L));
			ms.setNumEmptyBlocksMined(ms.getNumEmptyBlocksMined() + (isBlockEmpty ? 1 : 0));
			ms.setTotalFeesLostByEmptyBlocksGBT(
					ms.getTotalFeesLostByEmptyBlocksGBT() + (isBlockEmpty ? opFeesGBT.orElse(0L) : 0L));
			ms.setTotalFeesLostByEmptyBlocksOBA(
					ms.getTotalFeesLostByEmptyBlocksOBA() + (isBlockEmpty ? opFeesOBA.orElse(0L) : 0L));
			ms.setTotalFeesNotRelayedToUs(ms.getTotalFeesNotRelayedToUs() + opFeesNotRelayed.orElse(0L));
			ms.setTotalFeesByBlockReward(ms.getTotalFeesByBlockReward() + blockReward(blockHeight));
			return ms;
		}).defaultIfEmpty(new MinerStatistics(minerName, 1, -1, lostRewardGBT, lostRewardOBA,
				opFeesGBT.orElse(0L), opFeesOBA.orElse(0L), isBlockEmpty ? 1 : 0, isBlockEmpty ? opFeesGBT.orElse(0L) : 0L,
				isBlockEmpty ? opFeesOBA.orElse(0L) : 0L, opFeesNotRelayed.orElse(0L), Long.valueOf(blockReward(blockHeight))))
				.block();

		// Only save if another instance has not done it yet.
		if (minerStatistics != null && minerStatistics.getLastMinedBlock() != blockHeight) {
			minerStatistics.setLastMinedBlock(blockHeight);
			minerStatisticsRepository.save(minerStatistics).block();
		}
	}

	private boolean isEmpty(IgnoringBlock ib) {
		return ib.getMinedBlockData().getFeeableData().getNumTxs().orElse(0) == 0;
	}

	private long blockReward(int height) {
		int halvings = height / 210000;

		// Not going to see this. but anyway...
		if (halvings >= 64)
			return 0L;
		long subsidy = 5000000000L;// 50 Bitcoins
		subsidy >>= halvings;
		/*
		 * for (int i = 0; i < halvings; i++) {
		 * subsidy = subsidy / 2;
		 * }
		 */
		return subsidy;
	}
}
