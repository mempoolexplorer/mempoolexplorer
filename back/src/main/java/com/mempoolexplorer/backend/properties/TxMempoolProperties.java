package com.mempoolexplorer.backend.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "txmempool")
@Getter
@Setter
public class TxMempoolProperties {

	private int liveMiningQueueRefreshEachMillis = 5000;
	private int miningQueueMaxNumBlocks = 30;
	private int liveMiningQueueMaxTxs = 100000;
	private int maxTxsToCalculateTxsGraphs = 30000;
	private int maxLiveDataBufferSize = 100;
	private int numTimesTxIgnoredToMissed = 3;
	private int totalSatVBLostToMissed = 0;
	private int numTxMinedButNotInMemPoolToRaiseAlarm = 10;
}
