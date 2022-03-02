package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import com.mempoolexplorer.backend.entities.transaction.Transaction;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TxGraphList {
    private List<TxGraph> txsGraphList = new LinkedList<>();

    public void add(Transaction tx) {
        TxGraph newTxGraph = new TxGraph(tx);

        Iterator<TxGraph> it = txsGraphList.iterator();
        while (it.hasNext()) {
            TxGraph next = it.next();
            if (newTxGraph.containsAnyOf(next)) {
                newTxGraph.merge(next);
                it.remove();
            }
        }
        txsGraphList.add(newTxGraph);
    }

    public void sort() {
        txsGraphList.sort(
                Comparator.comparing(TxGraph::isNonLinear).thenComparing(txG -> txG.getTxSet().size()).reversed());
    }

}
