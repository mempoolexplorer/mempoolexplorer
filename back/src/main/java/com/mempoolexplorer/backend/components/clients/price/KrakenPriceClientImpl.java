package com.mempoolexplorer.backend.components.clients.price;

import java.util.Optional;

import com.mempoolexplorer.backend.price.entities.results.kraken.KrakenResult;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class KrakenPriceClientImpl implements PriceClient {

	@Override
	public Optional<Double> getBTCUSDPrice() {
		try {
			RestTemplate restTemplate = new RestTemplate();
			KrakenResult res = restTemplate
					.getForObject("https://api.kraken.com/0/public/Ticker?pair=xbtusd", KrakenResult.class);
			if (res != null && res.getError().isEmpty()) {
				return Optional.of(res.getResult().getTiker().getA().get(0));
			}
			return Optional.empty();
		} catch (Exception e) {
			log.error("Exception: {}", e);
			return Optional.empty();
		}
	}

}
