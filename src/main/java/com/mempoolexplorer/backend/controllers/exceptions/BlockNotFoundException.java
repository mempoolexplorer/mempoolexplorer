package com.mempoolexplorer.backend.controllers.exceptions;

public class BlockNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public BlockNotFoundException() {
		super();
	}

	public BlockNotFoundException(String message) {
		super(message);
	}

	public BlockNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
