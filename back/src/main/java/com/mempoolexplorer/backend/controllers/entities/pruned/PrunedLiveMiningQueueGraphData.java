package com.mempoolexplorer.backend.controllers.entities.pruned;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mempoolexplorer.backend.controllers.entities.CandidateBlockRecap;
import com.mempoolexplorer.backend.controllers.entities.InvariantTxParts;
import com.mempoolexplorer.backend.controllers.entities.transaction.TxDependenciesInfo;
import com.mempoolexplorer.backend.controllers.entities.transaction.TxIgnoredData;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrunedLiveMiningQueueGraphData {

	private long lastModTime;

	private int weightInLast10minutes;

	private int fblTxSatVByte;// First Block last Tx SatVByte

	@JsonProperty("mempool")
	private List<CandidateBlockRecap> candidateBlockRecapList = new ArrayList<>();

	private int blockSelected = -1;

	@JsonProperty("blockHistogram")
	private List<PrunedSatVByteHistogramElement> prunedCandidateBlockHistogram = new ArrayList<>();

	private int satVByteSelected = -1;

	@JsonProperty("satVByteHistogram")
	private List<PrunedTx> prunedTxs = new ArrayList<>();

	private int txIndexSelected = -1;

	private String txIdSelected = "";

	private TxDependenciesInfo txDependenciesInfo = null;

	private TxIgnoredData txIgnoredDataOurs;

	private TxIgnoredData txIgnoredDataBT;

	private InvariantTxParts tx;
}
