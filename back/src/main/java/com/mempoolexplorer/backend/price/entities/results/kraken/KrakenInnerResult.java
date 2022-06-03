package com.mempoolexplorer.backend.price.entities.results.kraken;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
public class KrakenInnerResult {

	@JsonProperty("XXBTZUSD")
	private KrakenTicker tiker;

	@JsonProperty("XXBTZUSD")
	public KrakenTicker getTiker() {
		return tiker;
	}

	@JsonProperty("XXBTZUSD")
	public void setTiker(KrakenTicker tiker) {
		this.tiker = tiker;
	}
}
