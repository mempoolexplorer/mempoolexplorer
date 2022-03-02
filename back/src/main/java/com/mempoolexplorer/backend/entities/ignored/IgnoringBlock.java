package com.mempoolexplorer.backend.entities.ignored;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.entities.CandidateBlockData;
import com.mempoolexplorer.backend.entities.MisMinedTransactions;
import com.mempoolexplorer.backend.entities.TimeSinceEnteredStatistics;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.block.MinedBlockData;
import com.mempoolexplorer.backend.entities.fees.FeeableData;
import com.mempoolexplorer.backend.entities.mempool.TxMempoolStats;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Document(collection = "ignoringBlocks")
public class IgnoringBlock {

	@JsonIgnore
	@Id
	private String dbKey;

	private AlgorithmType algorithmUsed;
	private Set<String> raceConditionTxsSet = new HashSet<>();
	private MinedBlockData minedBlockData;
	private CandidateBlockData candidateBlockData;
	private FeeableData relayedToUsData;
	private FeeableData ignoredONRByMinerData;
	private FeeableData inCommonData;
	private TimeSinceEnteredStatistics ignoredONRByMinerStatistics;
	private FeeableData ignoredByUsData;
	private FeeableData notRelayedTousData;
	private long lostReward;
	private long lostRewardExcludingNotInMempoolTx;
	private TxMempoolStats txMempoolStats;

	public IgnoringBlock(MisMinedTransactions mmt, TxMempoolContainer txMemPool) {
		this.algorithmUsed = mmt.getAlgorithmUsed();
		this.raceConditionTxsSet = mmt.getRaceConditionTxsSet();
		this.minedBlockData = mmt.getMinedBlockData();
		this.candidateBlockData = mmt.getCandidateBlockData();
		this.relayedToUsData = mmt.getRelayedToUsMapWD().getFeeableData();
		this.ignoredONRByMinerData = mmt.getIgnoredONRByMinerMapWD().getFeeableData();
		this.inCommonData = mmt.getInCommonMapWD().getFeeableData();
		this.ignoredONRByMinerStatistics = mmt.getIgnoredONRByMinerStatistics();
		this.ignoredByUsData = mmt.getIgnoredByUsMapWD().getFeeableData();
		this.notRelayedTousData = mmt.getNotRelayedToUsMapWD().getFeeableData();
		this.lostReward = mmt.getLostReward();
		this.lostRewardExcludingNotInMempoolTx = mmt.getLostRewardExcludingNotInMempoolTx();
		this.txMempoolStats = txMemPool.getTxMempoolStats();
		this.dbKey = builDBKey();
	}

	public static String builDBKey(int height, AlgorithmType algoType) {
		return height + "-" + algoType.toString();
	}

	private String builDBKey() {
		return builDBKey(minedBlockData.getHeight(), algorithmUsed);
	}

}
