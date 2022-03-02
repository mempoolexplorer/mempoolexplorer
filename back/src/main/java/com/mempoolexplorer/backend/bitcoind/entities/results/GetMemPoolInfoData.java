package com.mempoolexplorer.backend.bitcoind.entities.results;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetMemPoolInfoData {

	private Integer size; // Current tx count
	private Integer bytes; // Sum of all virtual transaction sizes as defined in BIP 141. Differs from
	// actual serialized size because witness data is discounted
	private Integer usage; // Total memory usage for the mempool in bytes
	private Integer maxmempool; // Maximum memory usage for the mempool in bytes
	private Integer mempoolminfee; // Minimum fee rate in BTC/kB for tx to be accepted. Is the maximum of
	// minrelaytxfee and minimum mempool fee
	private Integer minrelaytxfee; // Current minimum relay fee for transaction

}
