package com.mempoolexplorer.backend.controllers.exceptions;

public class AddressNotFoundInMemPoolException extends Exception {

	private static final long serialVersionUID = 1L;

	public AddressNotFoundInMemPoolException() {
		super();
	}

	public AddressNotFoundInMemPoolException(String message) {
		super(message);
	}

	public AddressNotFoundInMemPoolException(String message, Throwable cause) {
		super(message, cause);
	}

}
