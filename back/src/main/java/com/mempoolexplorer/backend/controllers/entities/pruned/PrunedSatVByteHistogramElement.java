package com.mempoolexplorer.backend.controllers.entities.pruned;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PrunedSatVByteHistogramElement {
	@JsonProperty("m")
	private int modSatVByte;
	@JsonProperty("n")
	private int numTxs;
	@JsonProperty("w")
	private int weight;
}
