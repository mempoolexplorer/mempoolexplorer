package com.mempoolexplorer.backend.components.factories;

import java.time.Clock;
import java.time.Instant;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockResultData;
import com.mempoolexplorer.backend.entities.block.Block;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BlockFactoryImpl implements BlockFactory {

	@Autowired
	private Clock clock;

	@Override
	public Block from(GetBlockResultData blockResultData, boolean connected) {
		Block block = new Block();
		block.setConnected(connected);
		block.setChangeTime(Instant.now(clock));
		block.setHash(blockResultData.getHash());
		block.setHeight(blockResultData.getHeight());
		block.setWeight(blockResultData.getWeight());
		block.setMinedTime(Instant.ofEpochSecond(blockResultData.getTime()));
		block.setMedianMinedTime(Instant.ofEpochSecond(blockResultData.getMediantime()));

		return block;
	}

}
