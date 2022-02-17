package com.mempoolexplorer.backend.entities.algorithm;

public enum AlgorithmType {

	BITCOIND("bitcoind", 0), OURS("ours", 1);

	private final String name;
	private final int index;

	private AlgorithmType(String name, int index) {
		this.name = name;
		this.index = index;
	}

	public String getName() {
		return name;
	}

	public int getIndex() {
		return index;
	}

}
