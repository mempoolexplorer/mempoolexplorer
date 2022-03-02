package com.mempoolexplorer.backend;

public class AppProfiles {
	private AppProfiles() {
		throw new IllegalStateException("Can't instatiate utility class");
	}

	public static final String DEV = "dev";
	public static final String PROD = "prod";
	public static final String MAIN_NET = "mainNet";
	public static final String TEST_NET = "testNet";
	public static final String TEST = "test";

}
