package com.mempoolexplorer.backend.bitcoind.entities.requests;

public enum EstimateType {

	UNSET("unset"), ECONOMICAL("economical"), CONSERVATIVE("conservative");

	private final String name;

	private EstimateType(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

}
