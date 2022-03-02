package com.mempoolexplorer.backend.entities.ignored;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mempoolexplorer.backend.controllers.entities.pruned.PrunedIgnoringBlock;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Document(collection = "ignoredTransactions")
public class IgnoredTransaction {

	@JsonIgnore
	@Id
	private String dbKey;

	private String txId;
	private AlgorithmType aType;// Ignored by which algorithm
	private List<PrunedIgnoringBlock> ignoringBlocks = new ArrayList<>();

	private IgnoredTxState state = IgnoredTxState.INMEMPOOL;
	private Double totalSatvBytesLost = 0D; // Total Satoshis per byte lost due to ignoration (sum of
	// (Tx.satByte-blockMinSatBytes) for each ignoring block)
	private Long totalFeesLost = 0l;// totalSatvBytesLost*tx.vSize
	private Instant timeWhenShouldHaveBeenMined;// Mining time of the fist block in which the tx should have been mined
	private Integer finallyMinedOnBlock = -1;// Block height on which transaction was finally mined, could be 0 (not
	// mined but deleted)

	public static String buildDBKey(String txId, AlgorithmType algoType) {
		return txId + "-" + algoType.toString();
	}

	public String buildDBKey() {
		return IgnoredTransaction.buildDBKey(this.txId, this.aType);
	}
}
