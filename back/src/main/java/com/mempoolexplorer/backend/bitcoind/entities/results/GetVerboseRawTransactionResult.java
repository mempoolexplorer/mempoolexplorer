package com.mempoolexplorer.backend.bitcoind.entities.results;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GetVerboseRawTransactionResult extends BitcoindResult {

	@JsonProperty("result")
	private GetVerboseRawTransactionResultData getRawTransactionResultData;

	public GetVerboseRawTransactionResultData getGetRawTransactionResultData() {
		return getRawTransactionResultData;
	}

	public void setGetRawTransactionResultData(GetVerboseRawTransactionResultData getRawTransactionResultData) {
		this.getRawTransactionResultData = getRawTransactionResultData;
	}

	@Override
	public String toString() {
		return "GetVerboseRawTransactionResult [getRawTransactionResultData=" + getRawTransactionResultData
				+ ", getError()=" + getError() + ", getId()=" + getId() + "]";
	}

}
