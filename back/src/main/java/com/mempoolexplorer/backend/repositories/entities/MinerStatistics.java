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
	private int lastMinedBlock;
	private Long totalLostRewardBT;
	private Long totalLostRewardCB;
	private Integer numBlocksMined;
	private Long totalLostRewardBTPerBlock;// Should be called avgLostRewardBTPerBlock
	private Long totalLostRewardCBPerBlock;// Should be called avgLostRewardCBPerBlock
	private Long totalFeesExcBlockReward;
	private Long totalFeesExcBlockRewardPerBlock;// Should be called avgFeesExcBlockRewardPerBlock
}
