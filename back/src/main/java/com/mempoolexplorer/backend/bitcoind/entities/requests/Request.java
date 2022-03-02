package com.mempoolexplorer.backend.bitcoind.entities.requests;

public abstract class Request {
	private String id;
	private String method;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

}
