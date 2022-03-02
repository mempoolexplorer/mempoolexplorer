package com.mempoolexplorer.backend.controllers.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
// @NoArgsConstructor
@ToString
public class CandidateBlockRecap {
	@JsonProperty("w")
	private int weight = 0;
	@JsonProperty("t")
	private long totalFees = 0;
	@JsonProperty("n")
	private int numTxs = 0;
}
