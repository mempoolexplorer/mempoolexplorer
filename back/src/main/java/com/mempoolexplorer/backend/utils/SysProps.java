package com.mempoolexplorer.backend.utils;

public class SysProps {
	public static final int MAX_BLOCK_SIZE = 1000000;
	public static final int EXPECTED_MEMPOOL_SIZE = 30000;

	public static final String NL = System.getProperty("line.separator");
	public static final float BEST_LOAD_FACTOR = 0.75f;// https://javaconceptoftheday.com/initial-capacity-and-load-factor-of-hashmap-in-java/
	public static final int EXPECTED_NUM_TX_IN_BLOCK = 5000;
	public static final int EXPECTED_MISMINED = 200;// Expected mismined set size
	public static final int HM_INITIAL_CAPACITY_FOR_EXPECTED_MISMINED = (int) ((1.0f + (1.0f - BEST_LOAD_FACTOR))
			* EXPECTED_MISMINED);
	public static final int HM_INITIAL_CAPACITY_FOR_BLOCK = (int) ((1.0f + (1.0f - BEST_LOAD_FACTOR))
			* EXPECTED_NUM_TX_IN_BLOCK);// BEST_LOAD_FACTOR*1.25=6250
	public static final float HM_INITIAL_CAPACITY_MULTIPLIER = 1.25f;
	public static final int MAX_BLOCK_WEIGHT = 4000000;// Segwit new size
	public static final int EXPECTED_MAX_ANCESTRY_CHANGES = 200;
	public static final int EXPECTED_MAX_IGNORED_TXS = 200;
	public static final int BLOCK_HEADER_WEIGHT = 332;// In Weight units = 83 bytes
	public static final int EXPECTED_BLOCK_HEADER_WEIGHT_VARIANCE = 8;
	public static final String MINER_NAME_UNKNOWN = "unknown";
	public static final String MINED_BY_START = "Mined by ";
	public static final String MINED_BY_END = "\\";
	public static String GLOBAL_MINER_NAME = "global_miner_name";
}
