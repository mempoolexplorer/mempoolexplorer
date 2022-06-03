package com.mempoolexplorer.backend.price.entities.results.binance;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class BinanceResult {
	private Double mins;
	private Double price;
}
