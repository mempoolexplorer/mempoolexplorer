package com.mempoolexplorer.backend.components;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.mempoolexplorer.backend.components.alarms.AlarmLogger;
import com.mempoolexplorer.backend.entities.MisMinedTransactions;
import com.mempoolexplorer.backend.properties.TxMempoolProperties;
import com.mempoolexplorer.backend.utils.SysProps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MisMinedTransactionsCheckerImpl implements MisMinedTransactionsChecker {

	@Autowired
	private AlarmLogger alarmLogger;

	@Autowired
	private TxMempoolProperties txMempoolProperties;

	@Override
	public void check(MisMinedTransactions mmt) {

		checkMinedBlockData(mmt);
		checkCandidateBlockData(mmt);
		checkNotInMemPoolTxs(mmt);
		checkLostReward(mmt);
		checkConectivity(mmt);
		crossChecks(mmt);
	}

	private void checkConectivity(MisMinedTransactions mmt) {
		int numTxNotInMemPool = mmt.getNotRelayedToUsMapWD().getFeeableData().getNumTxs().orElse(0);
		if (numTxNotInMemPool >= txMempoolProperties.getNumTxMinedButNotInMemPoolToRaiseAlarm()) {
			addAlarm("NumTxMinedButNotInMemPool is: " + numTxNotInMemPool, mmt);
		}
	}

	// Checks if block.weight = sum of tx weight+coinbase+blockHeaderWeight
	private void checkMinedBlockData(MisMinedTransactions mmt) {
		int sumMinedWeight = mmt.getMinedBlockData().getFeeableData().getTotalWeight().orElse(0);
		int coinbaseWeight = mmt.getMinedBlockData().getCoinBaseTx().getWeight();
		int minedWeight = mmt.getMinedBlockData().getWeight();
		if ((minedWeight - (sumMinedWeight + coinbaseWeight
				+ SysProps.BLOCK_HEADER_WEIGHT)) > SysProps.EXPECTED_BLOCK_HEADER_WEIGHT_VARIANCE) {
			addAlarm("(minedWeight - (sumMinedWeight + coinbaseWeight + SysProps.BLOCK_HEADER_WEIGHT)) >8)", mmt);
		}
		int relayedToUsWeight = mmt.getRelayedToUsMapWD().getFeeableData().getTotalWeight().orElse(0);
		int notRelayedToUsWeight = mmt.getNotRelayedToUsMapWD().getFeeableData().getTotalWeight().orElse(0);
		int other = relayedToUsWeight + notRelayedToUsWeight + coinbaseWeight + SysProps.BLOCK_HEADER_WEIGHT;
		if ((minedWeight - other) > SysProps.EXPECTED_BLOCK_HEADER_WEIGHT_VARIANCE) {
			addAlarm("minedWeight=" + minedWeight
					+ "(relayedToUsWeight+notRelayedToUsWeight+coinbaseWeight+SysProps.BLOCK_HEADER_WEIGHT)=" + other,
					mmt);
		}
	}

	// Checks if fees, numTx and totalWeight in candidateBlock are the same as
	// counting/sum by this program
	private void checkCandidateBlockData(MisMinedTransactions mmt) {
		long candidateTotalFees = mmt.getCandidateBlockData().getFeeableData().getTotalBaseFee().orElse(0L);
		if (mmt.getCandidateBlockData().getTotalFees() != candidateTotalFees) {
			addAlarm("mmt.getCandidateBlockData().getTotalFees() != candidateTotalFees", mmt);

		}
		int numTx = mmt.getCandidateBlockData().getFeeableData().getNumTxs().orElse(0);
		if (mmt.getCandidateBlockData().getNumTxs() != numTx) {
			addAlarm("mmt.getCandidateBlockData().getNumTxs() != numTx", mmt);

		}
		int totalWeight = mmt.getCandidateBlockData().getFeeableData().getTotalWeight().orElse(0);
		if (mmt.getCandidateBlockData().getWeight() != totalWeight) {
			addAlarm("mmt.getCandidateBlockData().getWeight() != totalWeight", mmt);

		}
	}

	private void crossChecks(MisMinedTransactions mmt) {
		int candidateBlockWeight = mmt.getCandidateBlockData().getWeight();
		int relayedToUsWeight = mmt.getRelayedToUsMapWD().getFeeableData().getTotalWeight().orElse(0);
		int ignoredOrNotReceivedByMinerWeight = mmt.getIgnoredONRByMinerMapWD().getFeeableData()
				.getTotalWeight().orElse(0);
		int ignoredByUsWeight = mmt.getIgnoredByUsMapWD()
				.getFeeableData().getTotalWeight().orElse(0);

		if ((candidateBlockWeight - relayedToUsWeight) != (ignoredOrNotReceivedByMinerWeight
				- ignoredByUsWeight)) {
			addAlarm(
					"(candidateBlockWeight-relayedToUsWeight) != (ignoredOrNotReceivedByMinerWeight-ignoredByUsWeight)",
					mmt);

		}

		long candidateBlockFees = mmt.getCandidateBlockData().getTotalFees();
		long relayedToUsFees = mmt.getRelayedToUsMapWD().getFeeableData().getTotalBaseFee().orElse(0L);
		long ignoredOrNotReceivedByMinerFees = mmt.getIgnoredONRByMinerMapWD().getFeeableData()
				.getTotalBaseFee().orElse(0L);
		long ignoredByUsFees = mmt.getIgnoredByUsMapWD()
				.getFeeableData().getTotalBaseFee().orElse(0L);

		if ((candidateBlockFees - relayedToUsFees) != (ignoredOrNotReceivedByMinerFees
				- ignoredByUsFees)) {
			addAlarm(
					"(candidateBlockFees- relayedToUsFees) != (ignoredOrNotReceivedByMinerFees- ignoredByUsFees )",
					mmt);

		}
	}

	// Check if block.notInMemPoolTxSet+coinbase = notRelayedToUsSet (for
	// mempool coherence)
	private void checkNotInMemPoolTxs(MisMinedTransactions mmt) {
		Set<String> blockSet = new HashSet<String>();
		blockSet.addAll(mmt.getBlock().getNotInMemPoolTransactions().keySet());
		blockSet.add(mmt.getBlock().getCoinBaseTx().getTxId());
		if (blockSet.size() != mmt.getNotRelayedToUsSet().size()) {
			addAlarm("blockSet.size() != mmt.getNotRelayedToUsSet().size()", mmt);
			return;
		}
		if (!blockSet.stream().filter(txId -> !mmt.getNotRelayedToUsSet().contains(txId))
				.collect(Collectors.toList()).isEmpty()
				|| !mmt.getNotRelayedToUsSet().stream().filter(txId -> !blockSet.contains(txId))
						.collect(Collectors.toList()).isEmpty()) {
			addAlarm("block.getNotInMemPoolTransactions() and notRelayedToUsSet are not equals", mmt);

		}
	}

	// Check if getLostRewardExcludingNotInMempoolTx is negative
	private void checkLostReward(MisMinedTransactions mmt) {
		if (mmt.getLostRewardExcludingNotInMempoolTx() < 0L) {
			addAlarm("Lost reward excluding not in mempool Tx: " + mmt.getLostRewardExcludingNotInMempoolTx()
					+ " Mined by: " + mmt.getMinedBlockData().getCoinBaseData().getMinerName(), mmt);
		}
	}

	private void addAlarm(String msg, MisMinedTransactions mmt) {
		StringBuilder sb = new StringBuilder();
		sb.append(mmt.getAlgorithmUsed().toString());
		sb.append(" - ");
		sb.append(msg);
		sb.append(", in block: ");
		sb.append(mmt.getBlock().getHeight());
		alarmLogger.addAlarm(sb.toString());
	}
}
