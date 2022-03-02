package com.mempoolexplorer.backend.utils;

import java.math.BigDecimal;

public class JSONUtils {

	private JSONUtils() {
		throw new IllegalStateException("Utility class");
	}

	public static Long jsonToAmount(BigDecimal value) {
		return value.movePointRight(8).longValue();
	}

	// BTC/KiloVirtualByte to Satoshy/VirtualByte
	public static Double BTCkVbyteToSatVbyte(BigDecimal value) {
		return value.movePointRight(5).doubleValue();
	}

}
