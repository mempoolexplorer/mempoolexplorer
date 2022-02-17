package com.mempoolexplorer.backend.threads;

import java.util.Optional;

import com.mempoolexplorer.backend.BackendApp;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolInfoData;
import com.mempoolexplorer.backend.components.clients.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.events.MempoolSeqEventQueueContainer;
import com.mempoolexplorer.backend.components.containers.igtxcache.IgTxCacheContainer;
import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.components.factories.TxPoolFiller;
import com.mempoolexplorer.backend.entities.block.Block;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.jobs.BlockChainInfoRefresherJob;
import com.mempoolexplorer.backend.jobs.BlockTemplateRefresherJob;
import com.mempoolexplorer.backend.jobs.SmartFeesRefresherJob;
import com.mempoolexplorer.backend.services.IgnoredEntitiesService;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * Deques ZMQ sequence events and treats them acordingly.
 * 
 * When starting, checks if zmqSequence==0, in that case bitcoind is starting
 * and all it's mempool will be received as MempoolSeqEvents. If not, then a
 * bitcoindClient.getRawMempoolNonVerbose will be called and a (int)
 * mempoolSequence obtained. Then, we discard mempoolSequenceEvents until it's
 * mempoolSequence matches the later. See
 * https://github.com/bitcoin/bitcoin/blob/master/doc/zmq.md#usage
 * 
 * Also, checks if zmqSequence and mempoolSequence are complete (no gaps). If
 * there is a gap a mempool reset needs to be done, because we have lost txs.
 * ZMQ msgs are not 100% reliable.
 * 
 * MempoolSequenceEvents for block connection and disconnection causes a
 * bitcoindClient.getBlock call and tx removal or addition respectively.
 * 
 * Be aware that mempoolSequence starts in 1 and zmqSequence starts in 0
 * mempoolSequence=Optional[1], zmqSequence=0
 * 
 */
@Component
@Slf4j
public class ZMQSequenceEventConsumer extends StoppableThread {

    @Autowired
    protected MempoolSeqEventQueueContainer blockingQueueContainer;
    @Autowired
    private TxMempoolContainer txMempoolContainer;
    @Autowired
    private TxPoolFiller txPoolFiller;
    @Autowired
    private BitcoindClient bitcoindClient;
    @Autowired
    private SmartFeesRefresherJob smartFeesRefresherJob;
    @Autowired
    private BlockTemplateRefresherJob blockTemplateRefresherJob;
    @Autowired
    private BlockChainInfoRefresherJob blockChainInfoRefresherJob;
    @Autowired
    private IgnoredEntitiesService ignoredEntitiesService;
    @Autowired
    private IgTxCacheContainer igTxCacheContainer;

    private boolean isStarting = true;

    // Incoming seqNumber
    private int lastZMQSequence = -1;

    @Override
    protected void doYourThing() throws InterruptedException {
        try {
            while (!isFinished()) {
                MempoolSeqEvent event = null;
                event = blockingQueueContainer.getBlockingQueue().take();
                log.debug("This is the event: {}", event);
                onEvent(event);
            }
        } catch (Exception e) {
            // We cannot recover from this. fastFail
            log.error("", e);
            alarmLogger.addAlarm("Fatal error" + ExceptionUtils.getStackTrace(e));
        }
    }

    private void onEvent(MempoolSeqEvent event) throws InterruptedException {
        if (isStarting) {
            onEventonStarting(event);
            isStarting = false;
        }
        treatEvent(event);
    }

    private void onEventonStarting(MempoolSeqEvent event) throws InterruptedException {
        if (event.getZmqSequence() == 0) {
            log.info("Bitcoind is starting while we are already up");
            // We don't need resetContainers in case of bitcoind crash, onErrorInZMQSequence
            // has done it for us.
        } else {
            log.info("Bitcoind is already working, asking for full mempool and mempoolSequence...");

            try {
                txPoolFiller.loadInitialMemPool();// loads txPoolContainer
            } catch (Exception e) {
                log.error("txPoolFiller.loadInitialMemPool ended unexpectedly.");
                alarmLogger.addAlarm("txPoolFiller.loadInitialMemPool ended unexpectedly.");
                fullReset();
            }
            log.info("Full mempool has been queried.");
        }
        // Fake a lastZMQSequence because we are starting
        lastZMQSequence = event.getZmqSequence() - 1;
    }

    private void treatEvent(MempoolSeqEvent event) throws InterruptedException {

        if (errorInZMQSequence(event)) {
            onErrorInZMQSequence(event);// Makes a full reset
            return;
        }
        switch (event.getEvent()) {
            case TXADD:
            case TXDEL:
                onTx(event);
                break;
            case BLOCKCON:
            case BLOCKDIS:
                onBlock(event);
                break;
            default:
                throw new IllegalArgumentException("unrecognized event type");
        }
    }

    private void checkMempoolSync() {
        if (!txMempoolContainer.isSyncWithBitcoind()) {
            try {
                GetMemPoolInfo gmi = bitcoindClient.getMemPoolInfo();
                GetMemPoolInfoData data = gmi.getGetMemPoolInfoData();
                if (data.getSize().intValue() == txMempoolContainer.getTxNumber().intValue()) {
                    log.info("Mempools synced!! Starting jobs.");
                    smartFeesRefresherJob.setStarted(true);
                    smartFeesRefresherJob.execute();// execute inmediately, it's thread safe.
                    blockTemplateRefresherJob.setStarted(true);
                    blockTemplateRefresherJob.execute();// execute inmediately, it's thread safe.
                    blockChainInfoRefresherJob.setStarted(true);
                    blockChainInfoRefresherJob.execute();// execute inmediately, it's thread safe.
                    log.info("Jobs started.");
                    log.info("Cleaning ignored/repudiated Txs that are not in mempool...");
                    ignoredEntitiesService.cleanIgTxNotInMempool();
                    ignoredEntitiesService.markRepudiatedTxNotInMemPool();
                    log.info("Clean complete.");
                    log.info("Loading ignored transactions in cache.");
                    igTxCacheContainer.calculate();
                    log.info("Ignored transactions loaded in cache.");
                    log.info("Node marked as synced.");
                    txMempoolContainer.setSyncWithBitcoind();
                } else {
                    log.info("Comparing mempools size: bitcoind:{} mempoolExplorerBackend:{}", data.getSize(),
                            txMempoolContainer.getTxNumber());
                }
            } catch (Exception e) {
                log.error("bitcoindClient.getMemPoolInfo() returned error. Stopping...");
                alarmLogger.addAlarm("bitcoindClient.getMemPoolInfo() returned error. Stopping...");
                BackendApp.exit();
            }
        }
    }

    private void onTx(MempoolSeqEvent event) {
        // Note: events could be discarded if currentMPS >= eventMPS (after loading a
        // full mempool). but we have found it causes tx loss. why?. don't know but we
        // will not discard any event.
        Optional<TxPoolChanges> opTxpc = txPoolFiller.obtainOnTxMemPoolChanges(event);
        opTxpc.ifPresent(txpc -> txMempoolContainer.refresh(txpc));
        // Log update if any
        opTxpc.ifPresent(txpc -> {
            if (log.isDebugEnabled() && !txpc.getTxAncestryChangesMap().isEmpty())
                log.debug(txpc.getTxAncestryChangesMap().toString());
        });
        // TODO Send to MempoolEventConsumer
        checkMempoolSync();
    }

    private void onBlock(MempoolSeqEvent event) {
        // Since a new block has arrived, we want to force as soon as possible a
        // blockTemplate refresh for having mining information of next block.
        forceRefreshBlockTemplate();

        // No mempoolSequence for block events
        Optional<Pair<TxPoolChanges, Block>> opPair = txPoolFiller.obtainOnBlockMemPoolChanges(event);
        if (opPair.isEmpty()) {
            return;// Error. Logging on txPoolFiller.
        }

        TxPoolChanges txpc = opPair.get().getLeft();
        Block block = opPair.get().getRight();

        // Update our mempool
        txMempoolContainer.refresh(txpc);
        // Log update if any
        if (log.isDebugEnabled() && !txpc.getTxAncestryChangesMap().isEmpty())
            log.debug(txpc.getTxAncestryChangesMap().toString());

        // TODO Send to MempoolEventConsumer
    }

    private void forceRefreshBlockTemplate() {
        blockTemplateRefresherJob.execute();
    }

    private void fullReset() {
        BackendApp.exit();
    }

    private void onErrorInZMQSequence(MempoolSeqEvent event) throws InterruptedException {
        // Somehow we have lost mempool events. We have to re-start again.
        log.error("We have lost a ZMQMessage, ZMQSequence not expected: {}, "
                + "Reset and waiting for new full mempool and mempoolSequence...", event.getZmqSequence());
        fullReset();
        // Event is reintroduced and it's not lost never. This is a must when bitcoind
        // re-starts and send a ZMQSequenceEvent = 0
        onEvent(event);
    }

    private boolean errorInZMQSequence(MempoolSeqEvent event) {
        return ((++lastZMQSequence) != event.getZmqSequence());
    }

}
