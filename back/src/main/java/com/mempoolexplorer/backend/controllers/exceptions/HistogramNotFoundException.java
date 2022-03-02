package com.mempoolexplorer.backend.controllers.exceptions;

public class HistogramNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public HistogramNotFoundException() {
		super();
	}

	public HistogramNotFoundException(String message) {
		super(message);
	}

	public HistogramNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
