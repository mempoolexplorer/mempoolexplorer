package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;
import java.util.TreeMap;

import com.mempoolexplorer.backend.entities.mempool.TxKey;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ModifiedMempool {

	private static Logger logger = LoggerFactory.getLogger(ModifiedMempool.class);

	private Map<String, TxKey> txKeyMap = new HashMap<>();

	private SortedMap<TxKey, ModifiedTx> txMemPool = new TreeMap<>();

	public void put(ModifiedTx tx) {
		// Removes previous tx in map if any. Modifications in-map are not allowed
		remove(tx.getTx().getTxId());
		TxKey txKey = new TxKey(tx.getTx().getTxId(), tx.getRealAncestorSatVByte(), tx.getTx().getTimeInSecs());
		txKeyMap.put(tx.getTx().getTxId(), txKey);
		txMemPool.put(txKey, tx);
	}

	public Optional<ModifiedTx> remove(String txId) {
		TxKey txKey = txKeyMap.remove(txId);
		if (null != txKey) {
			Optional<ModifiedTx> opModTx = Optional.ofNullable(txMemPool.remove(txKey));
			if (opModTx.isEmpty()) {
				logger.error("Non existing TxWithRealSatVByte in ModifiedMempool for remove, txId: {}", txId);
			}
			return opModTx;
		}
		return Optional.empty();
	}

	public Optional<ModifiedTx> getBestThan(Transaction tx) {
		if (txMemPool.isEmpty()) {
			return Optional.empty();
		}
		// Get lastKey, if not present throws NotSuchElementException!!!
		TxKey lastKey = txMemPool.lastKey();
		// if tx is already in our map, this should not be happening.
		if (txKeyMap.containsKey(tx.getTxId())) {
			logger.error("txKeyMap.containsKey(tx.getTxId()) THIS SHOULD NOT BE HAPPENNIG.");
			return Optional.empty();
		}
		// Compare tx and lastKey to return lastKey if better
		TxKey txKey = new TxKey(tx.getTxId(), tx.getSatvByteIncludingAncestors(), tx.getTimeInSecs());
		if (lastKey.compareTo(txKey) > 0) {
			return Optional.of(txMemPool.get(lastKey));
		}
		return Optional.empty();
	}

	public void substractParentDataToChildren(List<Transaction> notInAnyCandidateBlockTxListOf, Long feeToSubstract,
			int weightToSubstract) {
		for (Transaction tx : notInAnyCandidateBlockTxListOf) {
			Optional<ModifiedTx> opModTx = get(tx.getTxId());
			if (opModTx.isPresent()) {
				ModifiedTx modTx = opModTx.get();
				modTx.substract(feeToSubstract, weightToSubstract);
				put(modTx);
			} else {
				ModifiedTx modTx = new ModifiedTx(tx, feeToSubstract, weightToSubstract);
				put(modTx);
			}
		}

	}

	public boolean contains(String txid) {
		return (txKeyMap.get(txid) != null);
	}

	private Optional<ModifiedTx> get(String txId) {
		TxKey txKey = txKeyMap.get(txId);
		if (txKey == null) {
			return Optional.empty();
		}
		return Optional.of(txMemPool.get(txKey));
	}

}
