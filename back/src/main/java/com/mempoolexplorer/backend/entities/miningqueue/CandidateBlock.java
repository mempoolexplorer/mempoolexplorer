package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Stream;

import com.mempoolexplorer.backend.entities.transaction.Transaction;
import com.mempoolexplorer.backend.utils.SysProps;

public class CandidateBlock implements TxContainer {
	private int index = 0;// Position of this block in queue
	private int weight = 0;
	private long totalFees = 0;
	private int coinBaseWeight = 0;
	private int precedingTxsCount = 0; // Sum of all txs in preceding blocks

	private Map<String, TxToBeMined> txMap = new HashMap<>(SysProps.HM_INITIAL_CAPACITY_FOR_BLOCK);

	// It's descending ordered because adds are ordered
	private LinkedList<TxToBeMined> txList = new LinkedList<>();

	private int nextTxPositionInBlock = 0;

	private CandidateBlock() {
	}

	public static CandidateBlock empty() {
		return new CandidateBlock();
	}

	public CandidateBlock(int index, int coinBaseWeight) {
		this.index = index;
		this.coinBaseWeight = coinBaseWeight;
	}

	// Returns TxToBeMined created and added
	public TxToBeMined addTx(Transaction tx, Optional<Transaction> payingChildTx, Optional<List<Transaction>> reducedBy,
			double modifiedSatVByte) {
		weight += tx.getWeight();
		totalFees += tx.getFees().getBase();
		TxToBeMined txToBeMined = new TxToBeMined(tx, payingChildTx, reducedBy, this, nextTxPositionInBlock++,
				modifiedSatVByte);
		if (null != txMap.put(tx.getTxId(), txToBeMined)) {
			throw new IllegalStateException();
		}
		txList.add(txToBeMined);
		return txToBeMined;
	}

	// This only is valid only if this candidate block is the first one.
	public Optional<Boolean> checkIsCorrect() {
		if (index != 0) {
			return Optional.empty();
		}
		Iterator<Transaction> txIt = txList.stream().map(TxToBeMined::getTx).iterator();
		while (txIt.hasNext()) {
			Transaction tx = txIt.next();
			if (!txMap.containsKey(tx.getTxId())) {
				return Optional.of(Boolean.FALSE);
			}
			Iterator<String> txIdIt = tx.getTxAncestry().getDepends().iterator();
			while (txIdIt.hasNext()) {
				String txId = txIdIt.next();
				if (!txMap.containsKey(txId)) {
					return Optional.of(Boolean.TRUE);
				}
			}
		}
		return Optional.of(Boolean.TRUE);
	}

	public Optional<TxToBeMined> peekLastTx() {
		return Optional.ofNullable(txList.peekLast());
	}

	public int getFreeSpace() {
		return SysProps.MAX_BLOCK_WEIGHT - SysProps.BLOCK_HEADER_WEIGHT - SysProps.EXPECTED_BLOCK_HEADER_WEIGHT_VARIANCE
				- coinBaseWeight - weight;
	}

	public Stream<Entry<String, TxToBeMined>> getEntriesStream() {
		return txMap.entrySet().stream();
	}

	// Remember that all candidateBlocks stream is disordered because of filling big
	// tx's space with other smaller tx
	public Stream<TxToBeMined> getOrderedStream() {
		return txList.stream();
	}

	public Optional<TxToBeMined> getTx(String txId) {
		return Optional.ofNullable(txMap.get(txId));
	}

	public int getNumTxs() {
		return txList.size();
	}

	@Override
	public boolean containsKey(String txId) {
		return txMap.containsKey(txId);
	}

	public int numTxs() {
		return txList.size();
	}

	public int getIndex() {
		return index;
	}

	public int getWeight() {
		return weight;
	}

	public long getTotalFees() {
		return totalFees;
	}

	public int getCoinBaseWeight() {
		return coinBaseWeight;
	}

	public int getPrecedingTxsCount() {
		return precedingTxsCount;
	}

	public void setPrecedingTxsCount(int precedingTxsCount) {
		this.precedingTxsCount = precedingTxsCount;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CandidateBlock [position=");
		builder.append(index);
		builder.append(", weight=");
		builder.append(weight);
		builder.append(", totalFees=");
		builder.append(totalFees);
		builder.append(", coinBaseWeight=");
		builder.append(coinBaseWeight);
		builder.append(", txList=");
		for (TxToBeMined txToBeMined : txList) {
			builder.append("txId: ");
			builder.append(txToBeMined.getTx().getTxId());
			builder.append(", pos: ");
			builder.append(txToBeMined.getPositionInBlock());
			builder.append(", s/vBIncAn: ");
			builder.append(txToBeMined.getTx().getSatvByteIncludingAncestors());
			builder.append(", (" + txToBeMined.getTx().getTxAncestry().getAncestorCount() + ","
					+ txToBeMined.getTx().getTxAncestry().getDescendantCount() + ")");
			Optional<Transaction> payingChildTx = txToBeMined.getPayingChildTx();
			if (payingChildTx.isPresent()) {
				// cp stands for "child paying"
				builder.append(", cp: " + payingChildTx.get().getTxId());
			}
			Optional<List<Transaction>> parentsAlreadyInBlock = txToBeMined.getParentsAlreadyInBlock();
			if (parentsAlreadyInBlock.isPresent()) {
				// paob stands for "parents already on block"
				builder.append(", paob: ");
				Iterator<Transaction> it = parentsAlreadyInBlock.get().iterator();
				while (it.hasNext()) {
					Transaction nextTx = it.next();
					builder.append(nextTx.getTxId());
					if (it.hasNext()) {
						builder.append(", ");
					}
				}
			}
			builder.append(SysProps.NL);
		}
		builder.append("]");
		return builder.toString();
	}

}
