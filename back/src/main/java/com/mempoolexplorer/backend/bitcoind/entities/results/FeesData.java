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
public class FeesData {
	private BigDecimal base;
	private BigDecimal modified;
	private BigDecimal ancestor;
	private BigDecimal descendant;

}
