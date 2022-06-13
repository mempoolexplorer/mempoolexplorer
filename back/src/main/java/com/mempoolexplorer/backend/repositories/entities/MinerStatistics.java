package com.mempoolexplorer.backend.repositories.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
@Document(collection = "minerStatistics")
public class MinerStatistics {

	@Id
	private String minerName;
	private int numBlocksMined;
	private int lastMinedBlock;
	private Long totalLostRewardGBT;
	private Long totalLostRewardOBA;
	// Next pair are the same except for our fake miner.
	private Long totalFeesGBT;
	private Long totalFeesOBA;
	private int numEmptyBlocksMined;
	private Long totalFeesLostByEmptyBlocksGBT;
	private Long totalFeesLostByEmptyBlocksOBA;
	private Long totalFeesNotRelayedToUs;
}
