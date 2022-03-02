package com.mempoolexplorer.backend.services;

import java.util.Collection;
import java.util.List;

import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;
import com.mempoolexplorer.backend.entities.transaction.NotMinedTransaction;

public interface IgnoredEntitiesService {

        public void onDeleteTx(String txId);

        public void onNewBlockConnected(IgnoringBlock igBlock, List<String> blockTxIds,
                        Collection<NotMinedTransaction> ignoredTxs);

        void onNewBlockDisconnected(IgnoringBlock igBlock, List<String> blockTxIds,
                        Collection<NotMinedTransaction> ignoredTxs);

        public void cleanIgTxNotInMempool();

        public void onRecalculateBlockFromRecorder(IgnoringBlock igBlock);

        public void markRepudiatedTxNotInMemPool();
}
