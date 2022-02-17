package com.mempoolexplorer.backend.entities.fees;

import java.util.HashMap;
import java.util.Map;

/**
 * Map that stores transactions (whatever the type while implementing Feeable)
 * and the max/min of satoshis per byte.
 */
public class FeeableMapWithData<T extends Feeable> {
	FeeableData feeableData = new FeeableData();

	private Map<String, T> feeableMap = new HashMap<>();

	public FeeableMapWithData() {
	}

	public FeeableMapWithData(int expectedSize) {
		feeableMap = new HashMap<>(expectedSize);
	}

	public T put(T tx) {
		feeableData.checkFeeable(tx);
		return feeableMap.put(tx.getTxId(), tx);
	}

	public boolean containsKey(String txId) {
		return feeableMap.containsKey(txId);
	}

	public FeeableData getFeeableData() {
		return feeableData;
	}

	public Map<String, T> getFeeableMap() {
		return feeableMap;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("FeeableMapWithData [feeableData=");
		builder.append(feeableData);
		builder.append("]");
		return builder.toString();
	}

}
