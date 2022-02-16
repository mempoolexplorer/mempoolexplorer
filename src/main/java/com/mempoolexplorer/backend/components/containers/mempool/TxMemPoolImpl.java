package com.mempoolexplorer.backend.components.containers.mempool;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map.Entry;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.mempoolexplorer.backend.entities.mempool.TxKey;
import com.mempoolexplorer.backend.entities.mempool.TxMempoolStats;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TxMemPoolImpl implements TxMemPool {

	private ConcurrentSkipListMap<TxKey, Transaction> txMemPool = new ConcurrentSkipListMap<>();

	// This is very anoying but necessary since txPoolChanges.getRemovedTxsId() are
	// Strings, not TxKeys. :-(
	private ConcurrentHashMap<String, TxKey> txKeyMap = new ConcurrentHashMap<>();

	// Mapping between addressId and all txId where addressId appears
	private ConcurrentHashMap<String, Set<String>> addressIdToTxIdMap = new ConcurrentHashMap<>();

	private TxMempoolStats stats = new TxMempoolStats();

	@Override
	public void refresh(TxPoolChanges txPoolChanges) {
		txPoolChanges.getNewTxs().stream().forEach(tx -> {
			TxKey txKey = new TxKey(tx.getTxId(), tx.getSatvByteIncludingAncestors(), tx.getTimeInSecs());
			if (txKeyMap.get(tx.getTxId()) == null) {
				txKeyMap.put(tx.getTxId(), txKey);
				txMemPool.put(txKey, tx);
				addAddresses(tx);
				stats.addTx(tx);
			}
		});
		txPoolChanges.getRemovedTxsId().stream().forEach(txId -> {
			TxKey txKey = txKeyMap.remove(txId);
			if (null != txKey) {
				Transaction tx = txMemPool.remove(txKey);
				if (tx != null) {
					removeAddresses(tx);
					stats.removeTx(tx);
				} else {
					log.debug("Removing non existing tx from txMemPool, txId: {}", txId);
				}
			} else {
				log.debug("Removing non existing tx from txKeyMap mempool, txId: {}", txId);
			}
		});
		txPoolChanges.getTxAncestryChangesMap().entrySet().stream().forEach(entry -> {
			TxKey txKey = txKeyMap.remove(entry.getKey());
			if (null == txKey) {
				log.info("Non existing txKey in txKeyMap for update, txId: {}", entry.getKey());
				return;
			}
			Transaction oldTx = txMemPool.remove(txKey);
			if (null == oldTx) {
				log.info("Non existing tx in txMemPool for update, txId: {}", entry.getKey());
				return;
			}
			stats.removeTx(oldTx);
			// remove+put must be made each modification since tx modification while on map
			// is pretty unsafe. (suffered in my own skin)
			// We use a deepCopy of the Tx to not modify tx hodled in miningQueue
			oldTx = oldTx.deepCopy();
			oldTx.setFees(entry.getValue().getFees());
			oldTx.setTxAncestry(entry.getValue().getTxAncestry());
			txKey = new TxKey(oldTx.getTxId(), oldTx.getSatvByteIncludingAncestors(), oldTx.getTimeInSecs());
			txKeyMap.put(oldTx.getTxId(), txKey);
			txMemPool.put(txKey, oldTx);
			stats.addTx(oldTx);
		});
		logTxPoolChanges(txPoolChanges);
		if (stats.getNumTxs() != txKeyMap.size()) {
			log.error("stats.getNumTxs() {} and txKeyMap.size() {} are not the same:", stats.getNumTxs(),
					txKeyMap.size());
		}
	}

	@Override
	public Integer getTxNumber() {
		return txKeyMap.size();
	}

	@Override
	public TxMempoolStats getTxMempoolStats() {
		return stats;
	}

	@Override
	public Stream<Transaction> getDescendingTxStream() {
		return txMemPool.descendingMap().entrySet().stream().map(Entry::getValue);
	}

	@Override
	public boolean containsTxId(String txId) {
		// return txKeyMap.contains(txId);//This is death!! it refers to the value not
		// the key!!!
		return txKeyMap.containsKey(txId);
	}

	@Override
	public boolean containsAddrId(String addrId) {
		// return addressIdToTxIdMap.contains(txId);//This is death!! it refers to the
		// value not
		// the key!!!
		return addressIdToTxIdMap.containsKey(addrId);
	}

	@Override
	public Optional<Transaction> getTx(String txId) {
		TxKey txKey = txKeyMap.get(txId);
		if (txKey == null)
			return Optional.empty();
		Transaction transaction = txMemPool.get(txKey);
		return Optional.ofNullable(transaction);
	}

	@Override
	public Set<String> getAllParentsOf(Transaction tx) {
		// recursive witchcraft
		List<String> txDepends = tx.getTxAncestry().getDepends();
		if (!txDepends.isEmpty()) {
			Set<String> parentSet = txDepends.stream().collect(Collectors.toSet());
			Set<String> granpaSet = parentSet.stream().map(txId -> txKeyMap.get(txId)).filter(Objects::nonNull)
					.map(txKey -> txMemPool.get(txKey)).filter(Objects::nonNull).map(this::getAllParentsOf)
					.flatMap(Set::stream).collect(Collectors.toSet());
			parentSet.addAll(granpaSet);
			return parentSet;
		}
		return new HashSet<>();
	}

	@Override
	public Set<String> getAllChildrenOf(Transaction tx) {
		// recursive witchcraft
		List<String> txSpentBys = tx.getTxAncestry().getSpentby();
		if (!txSpentBys.isEmpty()) {
			Set<String> childrenSet = txSpentBys.stream().collect(Collectors.toSet());
			Set<String> granSonsSet = childrenSet.stream().map(txId -> txKeyMap.get(txId)).filter(Objects::nonNull)
					.map(txKey -> txMemPool.get(txKey)).filter(Objects::nonNull).map(this::getAllChildrenOf)
					.flatMap(Set::stream).collect(Collectors.toSet());
			childrenSet.addAll(granSonsSet);
			return childrenSet;
		}
		return new HashSet<>();
	}

	@Override
	public Set<String> getTxIdsOfAddress(String addrId) {
		Set<String> txIdsSet = addressIdToTxIdMap.get(addrId);
		if (txIdsSet != null) {
			return txIdsSet;
		}
		return new HashSet<>();
	}

	@Override
	public Stream<Transaction> getTxsAfter(Instant instant) {
		return txMemPool.values().stream().filter(tx -> tx.getTimeInSecs() > instant.getEpochSecond());
	}

	@Override
	public void drop() {
		txMemPool = new ConcurrentSkipListMap<>();
		txKeyMap = new ConcurrentHashMap<>();
		stats = new TxMempoolStats();
	}

	private Set<String> getAllAddressesOf(Transaction tx) {
		Set<String> retSet = new HashSet<>();
		// Carefull with null values in case of unrecognized scripts
		if (tx.getTxInputs() != null) {
			tx.getTxInputs().stream().forEach(txIn -> {
				if (txIn.getAddress() != null) {
					retSet.add(txIn.getAddress());
				}
			});
		}
		// Carefull with null values in case of unrecognized scripts
		if (tx.getTxOutputs() != null) {
			tx.getTxOutputs().stream().forEach(txOut -> {
				if (txOut.getAddress() != null) {
					retSet.add(txOut.getAddress());
				}
			});
		}
		return retSet;
	}

	private void addAddresses(Transaction tx) {
		Set<String> allAddresses = getAllAddressesOf(tx);
		for (String addrId : allAddresses) {
			Set<String> txIdsSet = addressIdToTxIdMap.get(addrId);
			if (txIdsSet == null) {
				txIdsSet = new HashSet<>();
			}
			txIdsSet.add(tx.getTxId());
			addressIdToTxIdMap.put(addrId, txIdsSet);
		}
	}

	private void removeAddresses(Transaction tx) {
		Set<String> allAddresses = getAllAddressesOf(tx);
		for (String addrId : allAddresses) {
			Set<String> txIdsSet = addressIdToTxIdMap.get(addrId);
			if (txIdsSet == null) {
				log.error("No transactions found for addrId: {}", addrId);
			} else {
				txIdsSet.remove(tx.getTxId());
				if (txIdsSet.isEmpty()) {
					addressIdToTxIdMap.remove(addrId);
				}
			}
		}
	}

	private void logTxPoolChanges(TxPoolChanges txpc) {
		StringBuilder sb = new StringBuilder();
		sb.append("TxPoolChanges: ");
		sb.append(txpc.getNewTxs().size());
		sb.append(" new transactions, ");
		sb.append(txpc.getRemovedTxsId().size());
		sb.append(" removed transactions, ");
		sb.append(txpc.getTxAncestryChangesMap().size());
		sb.append(" updated transactions.");
		if (log.isDebugEnabled()) {
			log.debug(sb.toString());
		}
	}

}
