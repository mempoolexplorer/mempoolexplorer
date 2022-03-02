package com.mempoolexplorer.backend.bitcoind.entities.requests;

import java.util.List;

public class StringArrayParamRequest extends Request {

	private List<String> params;// Esto es un array de objetos, pero de momento cuela

	public List<String> getParams() {
		return params;
	}

	public void setParams(List<String> params) {
		this.params = params;
	}

}
