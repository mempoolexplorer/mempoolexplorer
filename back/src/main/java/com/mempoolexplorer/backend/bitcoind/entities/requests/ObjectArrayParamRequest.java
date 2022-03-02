package com.mempoolexplorer.backend.bitcoind.entities.requests;

import java.util.List;

public class ObjectArrayParamRequest extends Request {

	private List<Object> params;

	public List<Object> getParams() {
		return params;
	}

	public void setParams(List<Object> params) {
		this.params = params;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("ObjectArrayParamRequest [params=");
		builder.append(params);
		builder.append("]");
		return builder.toString();
	}

}
