package com.mempoolexplorer.backend.components;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Deque;
import java.util.LinkedList;
import java.util.Optional;

import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 */

@Component
public class Tx10minBufferImpl implements Tx10minBuffer {

    @Autowired
    private TxMempoolContainer txMemPool;

    public enum Direction {
        ADD, DEL
    };

    public class IncomingTx {
        private Transaction tx;
        private Direction direction;

        public IncomingTx(Transaction tx, Direction direction) {
            this.tx = tx;
            this.direction = direction;
        }

        public Transaction getTx() {
            return tx;
        }

        public Direction getDirection() {
            return direction;
        }
    }

    private Deque<IncomingTx> tx10minBuffer = new LinkedList<IncomingTx>();
    private int totalWeight = 0;

    @Override
    public void register(TxPoolChanges txPoolChanges) {
        txPoolChanges.getNewTxs().stream().forEach(tx -> {
            addIncomingTx(new IncomingTx(tx, Direction.ADD));
        });

        txPoolChanges.getRemovedTxsId().stream().forEach(txId -> {
            Optional<Transaction> tx = txMemPool.getTx(txId);
            if (tx.isPresent()) {
                addOutgoingTx(new IncomingTx(tx.get(), Direction.DEL));
            }
        });
    }

    private synchronized void addIncomingTx(IncomingTx iTx) {
        tx10minBuffer.addFirst(iTx);
        totalWeight += iTx.getTx().getWeight();
        removeOldTxs();
    }

    private synchronized void addOutgoingTx(IncomingTx iTx) {
        tx10minBuffer.addFirst(iTx);
        totalWeight -= iTx.getTx().getWeight();
        removeOldTxs();
    }

    @Override
    public synchronized int getTotalWeight() {
        return totalWeight;
    }

    private void removeOldTxs() {
        IncomingTx last = tx10minBuffer.peekLast();
        if (last == null)
            return;
        while (last.getTx().getTimeInSecs() < Instant.now().minus(10, ChronoUnit.MINUTES).getEpochSecond()) {
            if (last.getDirection() == Direction.ADD) {
                totalWeight -= last.getTx().getWeight();
            } else {
                totalWeight += last.getTx().getWeight();
            }
            tx10minBuffer.removeLast();
            last = tx10minBuffer.peekLast();
            if (last == null)
                return;
        }
    }
}
