package com.mempoolexplorer.backend.components.clients.price;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class BitfinexPriceClientImpl implements PriceClient {

	@Override
	public Optional<Double> getBTCUSDPrice() {
		try {
			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<Double[]> res = restTemplate.getForEntity("https://api-pub.bitfinex.com/v2/ticker/tBTCUSD",
					Double[].class);
			if (res.hasBody()) {
				return (Optional.of(res.getBody()[0]));
			}
			return Optional.empty();
		} catch (Exception e) {
			log.error("Exception: {}", e);
			return Optional.empty();
		}
	}
}
