package com.mempoolexplorer.backend.jobs;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateResultData;
import com.mempoolexplorer.backend.components.alarms.AlarmLogger;
import com.mempoolexplorer.backend.components.clients.bitcoind.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.blocktemplate.BlockTemplateContainer;
import com.mempoolexplorer.backend.entities.blocktemplate.BlockTemplate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/**
 * This job only updates blockTemplateContainer with new TemplateBlocks
 */
@Slf4j
@Setter
@Getter
@Component
public class BlockTemplateRefresherJob {

    @Autowired
    private BitcoindClient bitcoindClient;
    @Autowired
    private BlockTemplateContainer blockTemplateContainer;
    @Autowired
    private AlarmLogger alarmLogger;

    private BitcoindCommunicationChecker bitcoindCommunicationChecker = new BitcoindCommunicationChecker();
    private boolean started = false;

    @Scheduled(fixedDelayString = "${bitcoindadapter.refreshBTIntervalMilliSec}")
    public void execute() {
        // This avoids unwanted starts before complete initialization or restart.
        if (!started)
            return;

        try {
            GetBlockTemplateResult blockTemplateResult = bitcoindClient.getBlockTemplateResult();
            if (blockTemplateResult.getError() != null) {
                alarmLogger.addAlarm("Can't get block template result. Maybe bitcoind is down? Error: "
                        + blockTemplateResult.getError());
                log.error("Can't get block template result. Maybe bitcoind is down? Error: {}",
                        blockTemplateResult.getError());
                bitcoindCommunicationChecker.addFail();
                return;
            }
            GetBlockTemplateResultData getBlockTemplateResultData = blockTemplateResult.getGetBlockTemplateResultData();
            BlockTemplate newBT = new BlockTemplate(getBlockTemplateResultData);
            blockTemplateContainer.push(newBT);
            log.info("New blockTemplate arrived from bitcoind");
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
