package com.mempoolexplorer.backend.price.entities.results.kraken;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class KrakenTicker {
	private List<Double> a;
	private Double o;
}
