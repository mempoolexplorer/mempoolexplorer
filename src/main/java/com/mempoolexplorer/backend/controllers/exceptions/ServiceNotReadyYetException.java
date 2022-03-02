package com.mempoolexplorer.backend.controllers.exceptions;

public class ServiceNotReadyYetException extends Exception {

	private static final long serialVersionUID = 1L;

	public ServiceNotReadyYetException() {
		super();
	}

	public ServiceNotReadyYetException(String message) {
		super(message);
	}

	public ServiceNotReadyYetException(String message, Throwable cause) {
		super(message, cause);
	}

}
