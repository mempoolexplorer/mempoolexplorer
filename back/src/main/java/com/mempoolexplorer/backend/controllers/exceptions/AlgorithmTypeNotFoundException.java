package com.mempoolexplorer.backend.controllers.exceptions;

public class AlgorithmTypeNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public AlgorithmTypeNotFoundException() {
		super();
	}

	public AlgorithmTypeNotFoundException(String message) {
		super(message);
	}

	public AlgorithmTypeNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

}
