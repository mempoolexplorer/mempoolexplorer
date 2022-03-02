package com.mempoolexplorer.backend.components.containers.mempool;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import com.mempoolexplorer.backend.entities.mempool.TxMempoolStats;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

public interface TxMempoolContainer {

	boolean isSyncWithBitcoind();

	void setSyncWithBitcoind();

	void refresh(TxPoolChanges txPoolChanges);

	Integer getTxNumber();

	TxMempoolStats getTxMempoolStats();

	Stream<Transaction> getDescendingTxStream();

	Set<String> getAllParentsOf(Transaction tx);

	Set<String> getAllChildrenOf(Transaction tx);

	boolean containsTxId(String txId);

	boolean containsAddrId(String addrId);

	Optional<Transaction> getTx(String txId);

	Set<String> getTxIdsOfAddress(String addrId);

	Stream<Transaction> getTxsAfter(Instant instant);

	void drop();

}
