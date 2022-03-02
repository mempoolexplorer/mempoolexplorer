package com.mempoolexplorer.backend.controllers.entities.transaction;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TxNode {

	@JsonProperty("i")
	private String txId;
	@JsonProperty("w")
	private int weight;// Segwit
	@JsonProperty("f")
	private long baseFee;// In sats
	@JsonProperty("t")
	private long timeInMillis;// Since entered in mempool
	@JsonProperty("b")
	private boolean bip125Replaceable;
	@JsonProperty("bi")
	private int containingBlockIndex;
	@JsonProperty("m")
	private double modifiedSatVByte;

}
