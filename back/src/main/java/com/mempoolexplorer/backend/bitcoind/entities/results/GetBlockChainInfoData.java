package com.mempoolexplorer.backend.bitcoind.entities.results;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetBlockChainInfoData {
	private String chain;
	private int blocks;
	private int headers;
	private String bestblockhash;
	private double difficulty;
	private long mediantime;
	private double verificationprogress;
	private boolean initialblockdownload;
	private String chainwork;
	private long size_on_disk;
	private boolean pruned;
	private String warnings;
}
