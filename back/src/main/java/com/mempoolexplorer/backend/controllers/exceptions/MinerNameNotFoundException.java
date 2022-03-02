package com.mempoolexplorer.backend.controllers.exceptions;

public class MinerNameNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public MinerNameNotFoundException() {
		super();
	}

	public MinerNameNotFoundException(String message) {
		super(message);
	}

	public MinerNameNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

}
