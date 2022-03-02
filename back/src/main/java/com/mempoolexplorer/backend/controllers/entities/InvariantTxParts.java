package com.mempoolexplorer.backend.controllers.entities;

import java.util.ArrayList;
import java.util.List;

import com.mempoolexplorer.backend.entities.transaction.Transaction;
import com.mempoolexplorer.backend.entities.transaction.TxInput;
import com.mempoolexplorer.backend.entities.transaction.TxOutput;

import lombok.Getter;

//Parts of Transaction that are invariant, so can be catched.
@Getter
public class InvariantTxParts {

    private InvariantTxParts() {
    }

    public InvariantTxParts(Transaction tx) {
        txId = tx.getTxId();
        txInputs = tx.getTxInputs();
        txOutputs = tx.getTxOutputs();
    }

    private String txId;
    private List<TxInput> txInputs = new ArrayList<>();
    private List<TxOutput> txOutputs = new ArrayList<>();
}
