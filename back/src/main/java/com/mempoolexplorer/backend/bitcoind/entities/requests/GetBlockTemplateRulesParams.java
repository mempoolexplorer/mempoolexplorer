package com.mempoolexplorer.backend.bitcoind.entities.requests;

import java.util.ArrayList;
import java.util.List;

public class GetBlockTemplateRulesParams {

	private List<String> rules = new ArrayList<>();

	public List<String> getRules() {
		return rules;
	}

	public void setRules(List<String> rules) {
		this.rules = rules;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("GetBlockTemplateRulesParams [rules=");
		builder.append(rules);
		builder.append("]");
		return builder.toString();
	}

}
