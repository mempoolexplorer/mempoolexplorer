package com.mempoolexplorer.backend.components.containers.price;

import org.springframework.stereotype.Component;

@Component
public class BitcoinPriceContainerImpl implements BitcoinPriceContainer {

	private Double usdPrice = Double.valueOf(0);

	@Override
	public void setUSDPrice(Double price) {
		usdPrice = price;
	}

	@Override
	public Double getUSDPrice() {
		return usdPrice;
	}

}
