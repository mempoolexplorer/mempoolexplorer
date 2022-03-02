package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RawMemPoolEntryData {

	private Integer vsize;// virtual transaction size as defined in BIP 141.
	// This is different from actual serialized size for witness transactions as
	// witness data is discounted.
	private Integer weight; // transaction weight as defined in BIP 141.
	private Long time;// The time the transaction entered the memory pool, Unix epoch time format
	private Integer height;// The time the transaction entered the memory pool, Unix epoch time format
	private Integer descendantcount;// The number of in-mempool descendant transactions (including this one)
	private Integer descendantsize;// The size of in-mempool descendants (including this one)
	private Integer ancestorcount;// The number of in-mempool ancestor transactions (including this one)
	private Integer ancestorsize;// The size of in-mempool ancestors (including this one)
	private FeesData fees;
	private List<String> depends = new ArrayList<>();// An array holding TXIDs of unconfirmed transactions
	private List<String> spentby = new ArrayList<>();// unconfirmed transactions spending outputs from this transaction
	// (txIds list)
	@JsonProperty("bip125-replaceable")
	private Boolean bip125Replaceable;

}
