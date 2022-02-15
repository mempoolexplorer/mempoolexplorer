package com.mempoolexplorer.backend.components.clients;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

public class BitcoindClientResponseErrorHandler implements ResponseErrorHandler {
	Logger logger = LoggerFactory.getLogger(BitcoindClientResponseErrorHandler.class);

	@Override
	public boolean hasError(ClientHttpResponse response) throws IOException {
		// Any error but 500. Sadly bitcoind returns error 500 as 404
		return response.getStatusCode().isError() && response.getStatusCode() != HttpStatus.INTERNAL_SERVER_ERROR;
	}

	@Override
	public void handleError(ClientHttpResponse response) throws IOException {
		logger.error("Bitcoind Response error: {} {}.", response.getStatusCode(), response.getStatusText());

	}

}
