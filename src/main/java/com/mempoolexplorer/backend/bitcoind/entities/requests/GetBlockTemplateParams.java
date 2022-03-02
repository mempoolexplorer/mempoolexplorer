package com.mempoolexplorer.backend.bitcoind.entities.requests;

import java.util.List;

public class GetBlockTemplateParams extends Request {
	private List<GetBlockTemplateRulesParams> params;

	public List<GetBlockTemplateRulesParams> getParams() {
		return params;
	}

	public void setParams(List<GetBlockTemplateRulesParams> params) {
		this.params = params;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("GetBlockTemplateParams [params=");
		builder.append(params);
		builder.append("]");
		return builder.toString();
	}

}
