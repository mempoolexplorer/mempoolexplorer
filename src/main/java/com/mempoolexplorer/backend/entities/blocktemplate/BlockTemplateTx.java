package com.mempoolexplorer.backend.entities.blocktemplate;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateTransaction;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BlockTemplateTx {

	private String txId;
	private long fee;
	private int sigops;
	private int weight;
	private int index;// Within block

	public BlockTemplateTx() {
	}

	// Better keep both classes different
	public BlockTemplateTx(GetBlockTemplateTransaction gbtTx, int index) {
		this.txId = gbtTx.getTxid();
		this.fee = gbtTx.getFee();
		this.sigops = gbtTx.getSigops();
		this.weight = gbtTx.getWeight();
		this.index = index;
	}

}
