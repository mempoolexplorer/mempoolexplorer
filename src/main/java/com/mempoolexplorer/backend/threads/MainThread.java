package com.mempoolexplorer.backend.threads;

import com.mempoolexplorer.backend.BackendApp;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfoData;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetIndexInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetIndexInfoData;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfoData;
import com.mempoolexplorer.backend.components.clients.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.bitcoindstate.BitcoindStateContainer;
import com.mempoolexplorer.backend.jobs.BlockChainInfoRefresherJob;
import com.mempoolexplorer.backend.jobs.BlockTemplateRefresherJob;
import com.mempoolexplorer.backend.jobs.SmartFeesRefresherJob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MainThread extends StoppableThread {

    @Autowired
    private BitcoindClient bitcoindClient;
    @Autowired
    private BitcoindStateContainer blockChainStateContainer;
    @Autowired
    private ZMQSequenceEventReceiver zmqSequenceEventReceiver;
    // @Autowired
    // private ZMQSequenceEventConsumer zmqSequenceEventConsumer;
    @Autowired
    private SmartFeesRefresherJob smartFeesRefresherJob;
    @Autowired
    private BlockTemplateRefresherJob blockTemplateRefresherJob;
    @Autowired
    private BlockChainInfoRefresherJob blockChainInfoRefresherJob;

    @Override
    protected void doYourThing() throws InterruptedException {
        if (!checkIndexOk()) {
            BackendApp.exit();// No comunication, force fail.
            return;
        }
        waitTillBitcoindStatusChecked();// Will wait until everything is ok
        log.info("ZMQ receiver and consumer are starting...");
        log.info("Jobs are starting...");
        // We keep the blockingQueue private among producer and consumer.
        // No size limit. Should be enough fast to not get "full"
        // zmqSequenceEventConsumer.start();
        zmqSequenceEventReceiver.start();
        smartFeesRefresherJob.setStarted(true);
        smartFeesRefresherJob.execute();// execute inmediately, it's thread safe.
        blockTemplateRefresherJob.setStarted(true);
        blockTemplateRefresherJob.execute();// execute inmediately, it's thread safe.
        blockChainInfoRefresherJob.setStarted(true);
        blockChainInfoRefresherJob.execute();// execute inmediately, it's thread safe.
        log.info("ZMQ receiver and consumer started.");
        log.info("Jobs started.");
    }

    public void finalization() {

        log.info("Shutting down MempoolExplorerBackEnd...");
        // zmqSequenceEventConsumer.shutdown();
        zmqSequenceEventReceiver.shutdown();
        log.info("MempoolExplorerBackEnd shutdown complete.");
        this.shutdown();
    }

    private void waitTillBitcoindStatusChecked() throws InterruptedException {
        waitTillMinNetworkPeers();
        waitTillBlockChainInSync();
    }

    private boolean checkIndexOk() throws InterruptedException {
        log.info("Checking txIndex are available...");
        boolean checked = false;
        while (!checked && !Thread.interrupted()) {
            GetIndexInfo ii = null;
            try {
                ii = bitcoindClient.getIndexInfo();
            } catch (Exception e) {
                log.error(e.toString());
                log.error("Cannot check IndexInfo from bitcoind node");
            }
            if (ii != null) {
                if (ii.getError() != null) {
                    log.error("bitcoind returned error:{}", ii.getError());
                } else {
                    log.debug(ii.toString());
                    checked = true;
                    GetIndexInfoData data = ii.getGetIndexInfoData();
                    if (data.getTxindex() == null) {
                        log.error(
                                "Bitcoind has no -txIndex option enabled, you MUST have that option to work properly.");
                        log.error("Consider adding -txindex=1 to bitcoin.conf file.");
                        return false;
                    } else {
                        log.info("Bitcoind has txindex enabled.");
                        return true;
                    }
                }
            }
            if (!checked) {
                log.info("Waiting 1 minute...");
                Thread.sleep(60000);
            }
        }
        return false;
    }

    private void waitTillMinNetworkPeers() throws InterruptedException {
        log.info("Checking NetworkInfo from bitcoind");
        boolean checked = false;
        while (!checked && !Thread.interrupted()) {
            GetNetworkInfo nti = null;
            try {
                nti = bitcoindClient.getNetworkInfo();
            } catch (Exception e) {
                log.error(e.toString());
                log.error("Cannot check NetworkInfo from bitcoind node");
            }
            if (nti != null) {
                if (nti.getError() != null) {
                    log.error("bitcoind returned error:{}", nti.getError());
                } else {
                    log.debug(nti.toString());
                    GetNetworkInfoData data = nti.getGetNetworkInfoData();
                    blockChainStateContainer.setNetworkInfoData(data);
                    if (data.isNetworkactive() && data.getConnections_out() >= 2) {
                        checked = true;
                        log.info("Bitcoind has {} out connections", data.getConnections_out());
                    } else {
                        log.warn("Bitcoind does not have at least two out connections");
                    }
                }
            }
            if (!checked) {
                log.info("Waiting 1 minute...");
                Thread.sleep(60000);
            }
        }
    }

    private void waitTillBlockChainInSync() throws InterruptedException {
        log.info("Checking blockChainInfo from bitcoind");
        boolean checked = false;
        while (!checked && !Thread.interrupted()) {
            GetBlockChainInfo bci = null;
            try {
                bci = bitcoindClient.getBlockChainInfo();
            } catch (Exception e) {
                log.error(e.toString());
                log.error("Cannot check BlockChainInfo from bitcoind node");
            }
            if (bci != null) {
                if (bci.getError() != null) {
                    log.error("bitcoind returned error:{}", bci.getError());
                } else {
                    log.debug(bci.toString());
                    GetBlockChainInfoData data = bci.getGetBlockChainInfoData();
                    blockChainStateContainer.setBlockChainInfoData(data);
                    if (data.isInitialblockdownload() == false) {
                        checked = true;
                        log.info("Bitcoind is working and has downloaded the full blockchain");
                    } else {
                        log.warn("Bitcoind is downloading blockChain");
                    }
                }
            }
            if (!checked) {
                log.info("Waiting 1 minute...");
                Thread.sleep(60000);
            }
        }
    }
}
