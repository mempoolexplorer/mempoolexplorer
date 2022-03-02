package com.mempoolexplorer.backend.components.factories;

import java.util.Optional;

import com.mempoolexplorer.backend.entities.block.Block;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.exceptions.TxPoolException;
import com.mempoolexplorer.backend.threads.MempoolSeqEvent;

import org.apache.commons.lang3.tuple.Pair;

public interface TxPoolFiller {
    /**
     * Loads the inital mempool by querying bitcoind for all tx in its mempool.
     * 
     * @return
     * @throws TxPoolException
     */
    void loadInitialMemPool() throws TxPoolException;

    /**
     * Obtain mempool changes from a {@link MempoolSeqEvent} (txadd or txdel). This
     * mempool changes includes ancestry changes due to transaction dependencies.
     * 
     * @param event
     * @return
     */
    Optional<TxPoolChanges> obtainOnTxMemPoolChanges(MempoolSeqEvent event);

    /**
     * Obtain mempool changes from a {@link MempoolSeqEvent} (blockcon or blockdis).
     * This mempool changes includes ancestry changes due to transaction
     * dependencies whithin the block.
     * 
     * @param event
     * @return
     */
    Optional<Pair<TxPoolChanges, Block>> obtainOnBlockMemPoolChanges(MempoolSeqEvent event);

}
