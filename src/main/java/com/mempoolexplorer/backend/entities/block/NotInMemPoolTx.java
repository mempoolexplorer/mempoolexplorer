package com.mempoolexplorer.backend.entities.block;

import com.mempoolexplorer.backend.entities.fees.Feeable;

public class NotInMemPoolTx implements Feeable {

	private String txId;
	private Long fees;// in Satoshis. Sadly this does not take into account Ancestors
	private Integer weight;// Sadly this does not take into account Ancestors

	public NotInMemPoolTx(String txId, Long fees, Integer weight) {
		super();
		this.txId = txId;
		this.fees = fees;
		this.weight = weight;
	}

	@Override
	public String getTxId() {
		return txId;
	}

	// This two methods should not return the same but we don't have enough
	// information
	@Override
	public double getSatvByteIncludingAncestors() {
		return ((double) fees / ((double) (weight) / 4.0d));
	}

	@Override
	public double getSatvByte() {
		return ((double) fees / ((double) (weight) / 4.0d));
	}

	@Override
	public long getBaseFees() {
		return fees;
	}

	// This has no information of ancestors
	@Override
	public long getAncestorFees() {
		return fees;
	}

	@Override
	public int getWeight() {
		return weight;
	}

	public void setTxId(String txId) {
		this.txId = txId;
	}

	public Long getFees() {
		return fees;
	}

	public void setFees(Long fees) {
		this.fees = fees;
	}

	public void setWeigth(Integer weigth) {
		this.weight = weigth;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("NotInMemPoolTx [txId=");
		builder.append(txId);
		builder.append(", fees=");
		builder.append(fees);
		builder.append(", weight=");
		builder.append(weight);
		builder.append("]");
		return builder.toString();
	}

}
