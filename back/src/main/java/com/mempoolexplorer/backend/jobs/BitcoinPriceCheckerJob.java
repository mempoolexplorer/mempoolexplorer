package com.mempoolexplorer.backend.jobs;

import java.util.Optional;

import com.mempoolexplorer.backend.components.alarms.AlarmLogger;
import com.mempoolexplorer.backend.components.clients.price.BinancePriceClientImpl;
import com.mempoolexplorer.backend.components.clients.price.BitfinexPriceClientImpl;
import com.mempoolexplorer.backend.components.clients.price.KrakenPriceClientImpl;
import com.mempoolexplorer.backend.components.containers.price.BitcoinPriceContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class BitcoinPriceCheckerJob {

    @Autowired
    private BitcoinPriceContainer bitcoinPriceContainer;
    @Autowired
    private BinancePriceClientImpl binancePriceClient;
    @Autowired
    private BitfinexPriceClientImpl bitfinexPriceClient;
    @Autowired
    private KrakenPriceClientImpl krakenPriceClient;
    @Autowired
    private AlarmLogger alarmLogger;

    @Scheduled(fixedDelayString = "${txmempool.priceRefreshMillis}")
    public void execute() {
        boolean anyAvailable = false;
        log.info("Checking bitcoin price...");
        Optional<Double> binancePrice = binancePriceClient.getBTCUSDPrice();
        if (binancePrice.isPresent()) {
            anyAvailable = true;
            log.info("Binance BTC price is: {}", binancePrice.get());
        } else {
            log.warn("Binance BTC price is not available");
        }
        Optional<Double> bitfinexPrice = bitfinexPriceClient.getBTCUSDPrice();
        if (bitfinexPrice.isPresent()) {
            anyAvailable = true;
            log.info("Bitfinex BTC price is: {}", bitfinexPrice.get());
        } else {
            log.warn("Bitfinex BTC price is not available");
        }
        Optional<Double> krakenPrice = krakenPriceClient.getBTCUSDPrice();
        if (krakenPrice.isPresent()) {
            anyAvailable = true;
            log.info("Kraken BTC price is: {}", krakenPrice.get());
        } else {
            log.warn("Kraken BTC price is not available");
        }
        if (!anyAvailable) {
            log.error("There is no price source available!");
            alarmLogger.addAlarm("There is no price source available!");
        } else {
            bitcoinPriceContainer.setUSDPrice(average(binancePrice, bitfinexPrice, krakenPrice));
        }
    }

    private Double average(Optional<Double> binancePrice, Optional<Double> bitfinexPrice,
            Optional<Double> krakenPrice) {
        double divisor = 0;
        double sum = 0;
        if (binancePrice.isPresent()) {
            sum = sum + binancePrice.get();
            divisor = divisor + 1;
        }
        if (bitfinexPrice.isPresent()) {
            sum = sum + binancePrice.get();
            divisor = divisor + 1;
        }
        if (krakenPrice.isPresent()) {
            sum = sum + binancePrice.get();
            divisor = divisor + 1;
        }
        return divisor != 0 ? sum / divisor : 0;
    }
}
