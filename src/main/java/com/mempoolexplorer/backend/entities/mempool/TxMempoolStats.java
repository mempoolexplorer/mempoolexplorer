package com.mempoolexplorer.backend.entities.mempool;

import com.mempoolexplorer.backend.entities.transaction.Transaction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TxMempoolStats {
    private int numTxs = 0;
    private int totalWeight = 0;
    private long totalFees = 0;

    public void addTx(Transaction tx) {
        numTxs += 1;
        totalWeight += tx.getWeight();
        totalFees += tx.getFees().getBase();
    }

    public void removeTx(Transaction tx) {
        numTxs -= 1;
        totalWeight -= tx.getWeight();
        totalFees -= tx.getFees().getBase();
    }
}
