package com.mempoolexplorer.backend.entities;

import java.util.LongSummaryStatistics;
import java.util.stream.Stream;

import com.mempoolexplorer.backend.entities.transaction.NotMinedTransaction;

public class TimeSinceEnteredStatistics {

	private long maxUpToMiningSecs;
	private long minUpToMiningSecs;
	private long averageUpToMiningSecs;

	public TimeSinceEnteredStatistics() {

	}

	public TimeSinceEnteredStatistics(long blockMinedTimeInSecs, Stream<NotMinedTransaction> nmts) {
		LongSummaryStatistics summaryStatistics = nmts
				.mapToLong(nmTx -> (blockMinedTimeInSecs - nmTx.getTx().getTimeInSecs())).summaryStatistics();
		this.maxUpToMiningSecs = summaryStatistics.getMax();
		this.minUpToMiningSecs = summaryStatistics.getMin();
		if (summaryStatistics.getCount() == 0) {
			this.averageUpToMiningSecs = 0;
		} else {
			this.averageUpToMiningSecs = summaryStatistics.getSum() / summaryStatistics.getCount();
		}
	}

	public long getMaxUpToMiningSecs() {
		return maxUpToMiningSecs;
	}

	public long getMinUpToMiningSecs() {
		return minUpToMiningSecs;
	}

	public long getAverageUpToMiningSecs() {
		return averageUpToMiningSecs;
	}

}
