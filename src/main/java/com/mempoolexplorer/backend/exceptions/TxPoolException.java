package com.mempoolexplorer.backend.exceptions;

//We cannot recover from this.
public class TxPoolException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public TxPoolException(String msg) {
		super(msg);
	}

	public TxPoolException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public TxPoolException(Throwable cause) {
		super(cause);
	}

}
