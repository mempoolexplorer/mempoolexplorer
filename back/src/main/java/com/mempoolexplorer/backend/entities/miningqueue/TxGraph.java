package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.HashSet;
import java.util.Set;

import com.mempoolexplorer.backend.entities.transaction.Transaction;
import com.mempoolexplorer.backend.entities.transaction.TxAncestry;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
// A TxGraph is a set of txIds dependant between each other. No other dependency
// information is stored in this class.
public class TxGraph {
    private Set<String> txSet = new HashSet<>();
    private boolean nonLinear = false;

    public TxGraph(Transaction tx) {
        txSet.add(tx.getTxId());
        TxAncestry txAncestry = tx.getTxAncestry();
        if ((txAncestry.getDepends().size() > 1) || (txAncestry.getSpentby().size() > 1))
            nonLinear = true;
        txAncestry.getDepends().stream().forEach(txId -> {
            txSet.add(txId);
        });
        txAncestry.getSpentby().stream().forEach(txId -> {
            txSet.add(txId);
        });
    }

    public boolean containsAnyOf(TxGraph txGraph) {
        for (String txId : txGraph.txSet) {
            if (txSet.contains(txId)) {
                return true;
            }
        }
        return false;
    }

    public void merge(TxGraph txGraph) {
        txSet.addAll(txGraph.txSet);
        nonLinear |= txGraph.nonLinear;
    }
}
