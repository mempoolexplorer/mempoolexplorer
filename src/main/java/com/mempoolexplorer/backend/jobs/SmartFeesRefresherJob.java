package com.mempoolexplorer.backend.jobs;

import java.util.List;

import com.mempoolexplorer.backend.bitcoind.entities.requests.EstimateType;
import com.mempoolexplorer.backend.bitcoind.entities.results.EstimateSmartFeeData;
import com.mempoolexplorer.backend.bitcoind.entities.results.EstimateSmartFeeResult;
import com.mempoolexplorer.backend.components.alarms.AlarmLogger;
import com.mempoolexplorer.backend.components.clients.BitcoindClient;
import com.mempoolexplorer.backend.components.containers.smartfees.SmartFeesContainer;
import com.mempoolexplorer.backend.entities.fees.SmartFee;
import com.mempoolexplorer.backend.entities.fees.SmartFees;
import com.mempoolexplorer.backend.utils.JSONUtils;

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
public class SmartFeesRefresherJob {

    @Autowired
    private SmartFeesContainer smartFeesContainer;
    @Autowired
    private AlarmLogger alarmLogger;
    @Autowired
    private BitcoindClient bitcoindClient;

    private BitcoindCommunicationChecker bitcoindCommunicationChecker = new BitcoindCommunicationChecker();
    private boolean started = false;

    @Scheduled(fixedDelayString = "${bitcoindadapter.refreshSmartFeesIntervalMilliSec}")
    public void execute() {
        if (!started) {
            return;// Do nothing until started.
        }

        try {
            SmartFees smartfees = new SmartFees();
            fillSmartFees(smartfees.getNormalSmartFeeList(), EstimateType.UNSET);
            fillSmartFees(smartfees.getEconomicalSmartFeeList(), EstimateType.ECONOMICAL);
            fillSmartFees(smartfees.getConservativeSmartFeeList(), EstimateType.CONSERVATIVE);
            smartFeesContainer.refresh(smartfees);
            log.info("SmartFees refreshed");
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

    // Search for the whole list of target blocks (up to 1008), but can stop if
    // Sat/VByte ==1 or is not a valid estimation (targetBlock>blocks)
    // EstimateSmartFeeResult(smartFees=EstimateSmartFeeData(feerate=null,
    // blocks=2))
    private void fillSmartFees(List<SmartFee> smartFees, EstimateType estimateType) {
        smartFees.clear();
        int blockIndex = 1;
        Double lastSatVByte = 1000d;
        while (blockIndex <= 1008 && lastSatVByte.compareTo(Double.valueOf(1d)) >= 0) {
            EstimateSmartFeeResult estimateSmartFeeResult = bitcoindClient.estimateSmartFee(estimateType,
                    blockIndex);
            if (estimateSmartFeeResult.getError() != null) {
                log.debug(estimateSmartFeeResult.toString());
                log.error("Error estimating fees: " + estimateSmartFeeResult.getError().toString());
                bitcoindCommunicationChecker.addFail();
                return;
            }
            EstimateSmartFeeData estimateSmartFeeData = estimateSmartFeeResult.getSmartFees();
            if (estimateSmartFeeData.getFeerate() == null) {
                log.warn("There is not enough data to calculate smartFees. No data will be provided.");
                return;
            }
            if (blockIndex > estimateSmartFeeData.getBlocks()) {
                break;
            }
            SmartFee smartFee = new SmartFee();
            smartFee.setTargetBlock(blockIndex);
            lastSatVByte = JSONUtils.BTCkVbyteToSatVbyte(estimateSmartFeeData.getFeerate());
            smartFee.setFeeRateSatVB(lastSatVByte);
            smartFees.add(smartFee);
            blockIndex++;
            if (lastSatVByte.compareTo(Double.valueOf(1d)) == 0) {
                break;
            }
        }
    }
}
