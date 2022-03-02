package com.mempoolexplorer.backend.components;

import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;

public interface Tx10minBuffer {
    void register(TxPoolChanges txPoolChanges);

    int getTotalWeight();
}
