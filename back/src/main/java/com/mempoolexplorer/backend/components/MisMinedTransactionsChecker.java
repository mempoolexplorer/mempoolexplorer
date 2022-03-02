package com.mempoolexplorer.backend.components;

import com.mempoolexplorer.backend.entities.MisMinedTransactions;

public interface MisMinedTransactionsChecker {

	void check(MisMinedTransactions mmt);

}
