package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetRawMemPoolVerbose extends BitcoindResult {

	@JsonProperty("result")
	private Map<String, RawMemPoolEntryData> rawMemPoolEntryDataMap;

}
