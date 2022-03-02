package com.mempoolexplorer.backend.entities;

public class CoinBaseData {

	private String ascciOfField;
	private String minerName;

	public CoinBaseData(String ascciOfField, String minerName) {
		super();
		this.ascciOfField = ascciOfField;
		this.minerName = minerName;
	}

	public String getAscciOfField() {
		return ascciOfField;
	}

	public String getMinerName() {
		return minerName;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CoinBaseData [ascciOfField=");
		builder.append(ascciOfField);
		builder.append(", minerName=");
		builder.append(minerName);
		builder.append("]");
		return builder.toString();
	}

}
