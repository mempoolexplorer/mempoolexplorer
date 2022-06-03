package com.mempoolexplorer.backend.components.clients.price;

import java.util.Optional;

import com.mempoolexplorer.backend.price.entities.results.binance.BinanceResult;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class BinancePriceClientImpl implements PriceClient {

	@Override
	public Optional<Double> getBTCUSDPrice() {
		try {
			RestTemplate restTemplate = new RestTemplate();
			BinanceResult res = restTemplate
					.getForObject("https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT", BinanceResult.class);
			if (res != null && res.getPrice() != null) {
				return Optional.of(res.getPrice());
			}
			return Optional.empty();
		} catch (Exception e) {
			log.error("Exception: {}", e);
			return Optional.empty();
		}
	}
}
