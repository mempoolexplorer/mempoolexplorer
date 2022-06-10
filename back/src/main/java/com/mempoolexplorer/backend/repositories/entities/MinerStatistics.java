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
	private Long avgLostRewardGBT;
	private Long avgLostRewardOBA;
	// Next pairs are the same except for our fake miner.
	private Long totalFeesGBT;
	private Long totalFeesOBA;
	private Long avgFeesGBT;
	private Long avgFeesOBA;
}
