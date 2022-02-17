package com.mempoolexplorer.backend.repositories.entities;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "minerToHeight")
public class MinerNameToBlockHeight {

	@Id
	private MinerToBlock minerToBlock;

	@Indexed
	private Instant medianMinedTime;

	public MinerNameToBlockHeight(String minerName, int blockHeight, Instant medianMinedTime) {
		this(new MinerToBlock(minerName, blockHeight), medianMinedTime);
	}
}
