package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.List;

public class GetVerboseRawTransactionInput {

	private String txid;// The TXID of the outpoint being spent, encoded as hex in RPC byte order. Not
	// present if this is a coinbase transaction
	private Integer vout;// The output index number (vout) of the outpoint being spent. The first output
	// in a transaction has an index of 0. Not present if this is a coinbase
	// transaction
	private ScriptSig scriptSig;// An object describing the signature script of this input. Not present if this
	// is a coinbase transaction
	private String coinbase;// (optional) The coinbase (similar to the hex field of a scriptSig) encoded as
	// hex. Only present if this is a coinbase transaction
	private Long sequence;// The input sequence number.
	private List<String> txinwitness;// (optional) Hex-encoded witness data. Only for segregated witness transactions

	public String getTxid() {
		return txid;
	}

	public void setTxid(String txid) {
		this.txid = txid;
	}

	public Integer getVout() {
		return vout;
	}

	public void setVout(Integer vout) {
		this.vout = vout;
	}

	public ScriptSig getScriptSig() {
		return scriptSig;
	}

	public void setScriptSig(ScriptSig scriptSig) {
		this.scriptSig = scriptSig;
	}

	public String getCoinbase() {
		return coinbase;
	}

	public void setCoinbase(String coinbase) {
		this.coinbase = coinbase;
	}

	public Long getSequence() {
		return sequence;
	}

	public void setSequence(Long sequence) {
		this.sequence = sequence;
	}

	public List<String> getTxinwitness() {
		return txinwitness;
	}

	public void setTxinwitness(List<String> txinwitness) {
		this.txinwitness = txinwitness;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("GetVerboseRawTransactionInputVector [txid=");
		builder.append(txid);
		builder.append(", vout=");
		builder.append(vout);
		builder.append(", scriptSig=");
		builder.append(scriptSig);
		builder.append(", coinbase=");
		builder.append(coinbase);
		builder.append(", sequence=");
		builder.append(sequence);
		builder.append(", txinwitness=");
		builder.append(txinwitness);
		builder.append("]");
		return builder.toString();
	}

}
