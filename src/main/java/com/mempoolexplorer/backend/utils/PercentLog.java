package com.mempoolexplorer.backend.utils;

import java.util.function.Consumer;

public class PercentLog {

	private int numElements;
	private int step = 10;// in %
	private int nextStep = 0;

	public PercentLog(int numElements) {
		this.numElements = numElements;
	}

	public PercentLog(int numElements, int step) {
		this.numElements = numElements;
		this.step = step;
	}

	public void update(int indexValue, Consumer<String> consumer) {
		if ((numElements <= 0) || (indexValue <= 0) || (step <= 0))
			return;

		if (indexValue >= (numElements - 1)) {
			if (nextStep <= 100) {
				consumer.accept("100%");
				nextStep = 101;// No more calls to consumer
			}
			return;
		}
		float percent = ((float) indexValue / (float) numElements) * 100.0f;
		Integer intPercent = (int) Math.abs(percent);
		if (intPercent > nextStep) {
			consumer.accept(String.valueOf(nextStep) + "%");
			nextStep += step;
		}
	}

}
