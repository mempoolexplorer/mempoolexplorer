package com.mempoolexplorer.backend.bitcoind.entities.results;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetBlockTemplateResult extends BitcoindResult {

	@JsonProperty("result")
	private GetBlockTemplateResultData getBlockTemplateResultData;

}
