package com.mempoolexplorer.backend.threads;

import java.util.List;
import java.util.Optional;

import com.mempoolexplorer.backend.BackendApp;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolInfoData;
import com.mempoolexplorer.backend.components.MinerNameResolver;
import com.mempoolexplorer.backend.components.MisMinedTransactionsChecker;
import com.mempoolexplorer.backend.components.Tx10minBuffer;
import com.mempoolexplorer.backend.components.clients.bitcoind.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.blocktemplate.BlockTemplateContainer;
import com.mempoolexplorer.backend.components.containers.events.MempoolSeqEventQueueContainer;
import com.mempoolexplorer.backend.components.containers.igtxcache.IgTxCacheContainer;
import com.mempoolexplorer.backend.components.containers.liveminingqueue.LiveMiningQueueContainer;
import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.components.containers.minernames.MinerNamesUnresolvedContainer;
import com.mempoolexplorer.backend.components.factories.TxPoolFiller;
import com.mempoolexplorer.backend.entities.CoinBaseData;
import com.mempoolexplorer.backend.entities.MisMinedTransactions;
import com.mempoolexplorer.backend.entities.block.Block;
import com.mempoolexplorer.backend.entities.blocktemplate.BlockTemplate;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;
import com.mempoolexplorer.backend.entities.mempool.TxPoolChanges;
import com.mempoolexplorer.backend.entities.miningqueue.CandidateBlock;
import com.mempoolexplorer.backend.entities.miningqueue.MiningQueue;
import com.mempoolexplorer.backend.jobs.BlockChainInfoRefresherJob;
import com.mempoolexplorer.backend.jobs.BlockTemplateRefresherJob;
import com.mempoolexplorer.backend.jobs.SmartFeesRefresherJob;
import com.mempoolexplorer.backend.properties.TxMempoolProperties;
import com.mempoolexplorer.backend.services.IgnoredEntitiesService;
import com.mempoolexplorer.backend.services.StatisticsService;
import com.mempoolexplorer.backend.utils.SysProps;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * Deques ZMQ sequence events and treats them acordingly.
 * 
 * Also, checks if zmqSequence are complete (no gaps). If
 * there is a gap a mempool reset needs to be done, because we have lost txs.
 * ZMQ msgs are not 100% reliable.
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
    @Autowired
    private LiveMiningQueueContainer liveMiningQueueContainer;
    @Autowired
    private TxMempoolProperties txMempoolProperties;
    @Autowired
    private BlockTemplateContainer blockTemplateContainer;
    @Autowired
    private MinerNameResolver minerNameResolver;
    @Autowired
    private MisMinedTransactionsChecker misMinedTransactionsChecker;
    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private MinerNamesUnresolvedContainer minerNamesUnresolvedContainer;
    @Autowired
    private Tx10minBuffer tx10minBuffer;
    // @Autowired
    // private AlgorithmDiffContainer algoDiffContainer;

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
        } catch (InterruptedException e) {
            log.info("ZMQSequenceEventConsumer interrupted");
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
                int bitcoindMempoolSize = data.getSize().intValue();
                int txMempoolContainerSize = txMempoolContainer.getTxNumber().intValue();
                int pendingEvents = blockingQueueContainer.getBlockingQueue().size();
                if ((bitcoindMempoolSize == txMempoolContainerSize) &&
                        pendingEvents == 0) {
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
                    log.info("liveMiningQueueContainer started.");
                    liveMiningQueueContainer.setAllowRefresh(true);
                    liveMiningQueueContainer.forceRefresh();
                    log.info("liveMiningQueueContainer refreshed.");
                    log.info("Node marked as synced.");
                    txMempoolContainer.setSyncWithBitcoind();
                } else {
                    log.info("Comparing mempools size: bitcoind:{} mempoolExplorerBackend:{}, pendingEvents:{}",
                            bitcoindMempoolSize, txMempoolContainerSize, pendingEvents);
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
        if (opTxpc.isEmpty()) {
            return;
        }
        treatTx(opTxpc.get());
        opTxpc.ifPresent(txpc -> txMempoolContainer.refresh(txpc));
        // Log ancestry changes if any
        opTxpc.ifPresent(txpc -> {
            if (log.isDebugEnabled() && !txpc.getTxAncestryChangesMap().isEmpty())
                log.debug(txpc.getTxAncestryChangesMap().toString());
        });
        liveMiningQueueContainer.refreshIfNeeded();
        checkMempoolSync();
    }

    private void treatTx(TxPoolChanges txpc) {
        // Register the weight of incoming Tx to know incoming weight / 10 minutes.
        tx10minBuffer.register(txpc);
        // Deleted tx can be an ignored one. Delete from db in that case.
        txpc.getRemovedTxsId().stream().forEach(ignoredEntitiesService::onDeleteTx);
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

        treatBlock(block, txpc);
        // Update our mempool
        txMempoolContainer.refresh(txpc);
        // Log ancestry changes if any
        if (log.isDebugEnabled() && !txpc.getTxAncestryChangesMap().isEmpty())
            log.debug(txpc.getTxAncestryChangesMap().toString());

        liveMiningQueueContainer.forceRefresh();
    }

    private void treatBlock(Block block, TxPoolChanges txpc) {
        if (Boolean.FALSE.equals(block.getConnected())) {
            alarmLogger.addAlarm("A disconnected block has arrived and has been ignored, height: " + block.getHeight()
                    + ", hash: " + block.getHash());
            return;// Ignore it, this disconnected block txs are added to mempool in
                   // onBlock.
        }

        List<String> minedBlockTxIds = txpc.getRemovedTxsId();
        log.info("New block(connected: {}, height: {}, hash: {}, txNum: {}) ---------------------------",
                block.getConnected(), block.getHeight(), block.getHash(), minedBlockTxIds.size());

        MiningQueue miningQueue = buildMiningQueue(block);
        // CandidateBlock can be empty
        CandidateBlock candidateBlock = miningQueue.getCandidateBlock(0).orElse(CandidateBlock.empty());
        /* boolean isCorrect = */ checkCandidateBlockIsCorrect(block.getHeight(), candidateBlock);

        // When two blocks arrive without refreshing mempool this is ALWAYS empty
        Optional<BlockTemplate> blockTemplate = blockTemplateContainer.pull(block.getHeight());
        CoinBaseData coinBaseData = resolveMinerName(block);

        MisMinedTransactions mmtBlockTemplate = new MisMinedTransactions(txMempoolContainer,
                blockTemplate.orElse(BlockTemplate.empty()), block, minedBlockTxIds, coinBaseData);
        MisMinedTransactions mmtCandidateBlock = new MisMinedTransactions(txMempoolContainer, candidateBlock, block,
                minedBlockTxIds, coinBaseData);

        // Disabled for the moment.
        // buildAndStoreAlgorithmDifferences(block, candidateBlock,
        // blockTemplate.orElse(BlockTemplate.empty()),
        // isCorrect);

        // Check for alarms or inconsistencies
        misMinedTransactionsChecker.check(mmtBlockTemplate);
        misMinedTransactionsChecker.check(mmtCandidateBlock);

        IgnoringBlock igBlockTemplate = new IgnoringBlock(mmtBlockTemplate, txMempoolContainer);
        IgnoringBlock igBlockOurs = new IgnoringBlock(mmtCandidateBlock, txMempoolContainer);

        // Save ignored and repudiated Txs, ignoringBlocks stats only if we are in sync
        if (txMempoolContainer.isSyncWithBitcoind()) {
            ignoredEntitiesService.onNewBlockConnected(igBlockTemplate, minedBlockTxIds,
                    mmtBlockTemplate.getIgnoredONRByMinerMapWD().getFeeableMap().values());
            ignoredEntitiesService.onNewBlockConnected(igBlockOurs, minedBlockTxIds,
                    mmtCandidateBlock.getIgnoredONRByMinerMapWD().getFeeableMap().values());
            statisticsService.saveStatisticsToDB(igBlockTemplate, igBlockOurs);
            igTxCacheContainer.calculate();
        }
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

    private MiningQueue buildMiningQueue(Block block) {
        MiningQueue miningQueue = MiningQueue.buildFrom(List.of(block.getCoinBaseTx().getWeight()), txMempoolContainer,
                txMempoolProperties.getLiveMiningQueueMaxTxs(), 1, txMempoolProperties.getMaxTxsToCalculateTxsGraphs());
        if (miningQueue.isHadErrors()) {
            alarmLogger.addAlarm("Mining Queue had errors, in OnNewBlock");
        }
        return miningQueue;
    }

    private boolean checkCandidateBlockIsCorrect(int blockHeight, CandidateBlock candidateBlock) {
        Optional<Boolean> opIsCorrect = candidateBlock.checkIsCorrect();
        if (opIsCorrect.isPresent()) {
            boolean isCorrect = opIsCorrect.get();
            if (!isCorrect) {
                alarmLogger.addAlarm("CandidateBlock is incorrect in block:" + blockHeight);
            }
            return isCorrect;
        } else {
            alarmLogger.addAlarm("We can't determinate if CandidateBlock is incorrect in block:" + blockHeight);
            return false;
        }
    }

    private CoinBaseData resolveMinerName(Block block) {
        CoinBaseData coinBaseData = minerNameResolver.resolveFrom(block.getCoinBaseTx().getvInField());

        if (coinBaseData.getMinerName().compareTo(SysProps.MINER_NAME_UNKNOWN) == 0) {
            minerNamesUnresolvedContainer.addCoinBaseField(coinBaseData.getAscciOfField(), block.getHeight());
        }
        return coinBaseData;
    }

    // private void buildAndStoreAlgorithmDifferences(Block block, CandidateBlock
    // candidateBlock,
    // BlockTemplate blockTemplate, boolean isCorrect) {
    // AlgorithmDiff ad = new AlgorithmDiff(txMempoolContainer, candidateBlock,
    // blockTemplate, block.getHeight(),
    // isCorrect);
    // algoDiffContainer.put(ad);

    // Optional<Long> bitcoindTotalBaseFee = ad.getBitcoindData().getTotalBaseFee();
    // Optional<Long> oursTotalBaseFee = ad.getOursData().getTotalBaseFee();

    // if (bitcoindTotalBaseFee.isPresent() && oursTotalBaseFee.isPresent()
    // && bitcoindTotalBaseFee.get().longValue() >
    // oursTotalBaseFee.get().longValue()) {
    // alarmLogger.addAlarm("Bitcoind algorithm better than us in block: " +
    // block.getHeight());
    // }
    // }
}
