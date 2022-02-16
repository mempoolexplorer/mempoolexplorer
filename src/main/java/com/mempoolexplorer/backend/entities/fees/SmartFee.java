package com.mempoolexplorer.backend.entities.fees;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class SmartFee {
	@JsonProperty("tb")
	private int targetBlock;// Confirmation target within targetBlock blocks.
	@JsonProperty("fr")
	private double feeRateSatVB;// Fee rate in Satoshis per virtual byte.
}
