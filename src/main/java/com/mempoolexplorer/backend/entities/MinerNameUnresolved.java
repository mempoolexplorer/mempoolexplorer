package com.mempoolexplorer.backend.entities;

public class MinerNameUnresolved {

	private String coinBaseField;
	private int blockHeight;

	public MinerNameUnresolved(String coinBaseField, int blockHeight) {
		super();
		this.coinBaseField = coinBaseField;
		this.blockHeight = blockHeight;
	}

	public String getCoinBaseField() {
		return coinBaseField;
	}

	public int getBlockHeight() {
		return blockHeight;
	}

}
