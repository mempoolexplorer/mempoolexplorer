package com.mempoolexplorer.backend.controllers.entities;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteLiveMiningQueueGraphData {

	private long lastModTime;

	private int numTxsInMempool;

	private int numTxsInMiningQueue;

	private int weightInLast10minutes;

	List<CandidateBlockRecap> candidateBlockRecapList = new ArrayList<>();

	// This list can be disordered because a small tx with low satVByte filling gaps
	// of big tx with high satVByte, or simply due to CPFP
	List<CandidateBlockHistogram> candidateBlockHistogramList = new ArrayList<>();

	public static CompleteLiveMiningQueueGraphData empty() {
		return new CompleteLiveMiningQueueGraphData();
	}

}
