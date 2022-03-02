package com.mempoolexplorer.backend.entities.transaction;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TxInput {
	private String address;// Can be null
	// coinBase transaction
	private long amount;// In Satoshis.
	private String txId;// Transaction where output is being spent by this input
	private int vOutIndex;// The output index number (vout) of the outpoint being spent. The first output
	// in a transaction has an index of 0. Not present if this is a coinbase
	// transaction
	private String coinbase;// Coinbase, normally null.

	public TxInput deepCopy() {
		TxInput txi = new TxInput();
		txi.setAddress(this.address);
		txi.setAmount(this.amount);
		txi.setTxId(this.txId);
		txi.setVOutIndex(this.vOutIndex);
		txi.setCoinbase(this.coinbase);
		return txi;
	}

}
