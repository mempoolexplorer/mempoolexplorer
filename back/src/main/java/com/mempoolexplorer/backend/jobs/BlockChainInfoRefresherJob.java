package com.mempoolexplorer.backend.jobs;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfoData;
import com.mempoolexplorer.backend.components.alarms.AlarmLogger;
import com.mempoolexplorer.backend.components.clients.bitcoind.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.bitcoindstate.BitcoindStateContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Setter
@Getter
@Component
public class BlockChainInfoRefresherJob {

    @Autowired
    private BitcoindClient bitcoindClient;
    @Autowired
    private BitcoindStateContainer bitcoindStateContainer;
    @Autowired
    private AlarmLogger alarmLogger;

    private BitcoindCommunicationChecker bitcoindCommunicationChecker = new BitcoindCommunicationChecker();
    private boolean started = false;

    @Scheduled(fixedDelayString = "${bitcoindadapter.refreshBCIIntervalMilliSec}")
    public void execute() {
        // This avoids unwanted starts before complete initialization or restart.
        if (!started)
            return;

        try {
            GetBlockChainInfo blockChainInfo = bitcoindClient.getBlockChainInfo();
            if (blockChainInfo.getError() != null) {
                alarmLogger.addAlarm("Can't get blockChainInfo result. Maybe bitcoind is down? Error: "
                        + blockChainInfo.getError());
                log.error("Can't get blockChainInfo result. Maybe bitcoind is down? Error: {}",
                        blockChainInfo.getError());
                return;
            }
            GetBlockChainInfoData getBlockChainInfoData = blockChainInfo.getGetBlockChainInfoData();
            bitcoindStateContainer.setBlockChainInfoData(getBlockChainInfoData);
            log.info("New blockChainInfo arrived from bitcoind");
            bitcoindCommunicationChecker.addOk();
        } catch (ResourceAccessException e) {
            log.error("Seems bitcoind is down {}", e.getMessage());
            alarmLogger.addAlarm("Seems bitcoind is down." + e.getMessage());
            bitcoindCommunicationChecker.addFail();
        } catch (Exception e) {
            alarmLogger.addAlarm("Exception: " + e.getMessage());
            log.error("Exception: ", e);
            bitcoindCommunicationChecker.addFail();
        }
    }
}
