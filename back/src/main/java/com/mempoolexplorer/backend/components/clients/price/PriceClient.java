package com.mempoolexplorer.backend.components.clients.price;

import java.util.Optional;

public interface PriceClient {

	public Optional<Double> getBTCUSDPrice();
}
