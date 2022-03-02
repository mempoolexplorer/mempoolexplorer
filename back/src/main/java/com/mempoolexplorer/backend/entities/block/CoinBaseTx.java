package com.mempoolexplorer.backend.entities.block;

public class CoinBaseTx {

	private String txId;
	private String vInField;
	private Integer weight;

	public CoinBaseTx() {
		super();
	}

	public CoinBaseTx(String txId, String vInField, Integer weight) {
		super();
		this.txId = txId;
		this.vInField = vInField;
		this.weight = weight;
	}

	public String getTxId() {
		return txId;
	}

	public void setTxId(String txId) {
		this.txId = txId;
	}

	public String getvInField() {
		return vInField;
	}

	public void setvInField(String vInField) {
		this.vInField = vInField;
	}

	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CoinBaseTx [txId=");
		builder.append(txId);
		builder.append(", vInField=");
		builder.append(vInField);
		builder.append(", weight=");
		builder.append(weight);
		builder.append("]");
		return builder.toString();
	}

}
