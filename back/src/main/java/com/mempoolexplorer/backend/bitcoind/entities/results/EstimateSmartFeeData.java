package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class EstimateSmartFeeData {

	private BigDecimal feerate; // estimate fee rate in BTC/kB
	private int blocks; // number of blocks for which the estimate is valid
}
