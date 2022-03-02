package com.mempoolexplorer.backend.components.factories;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockResultData;
import com.mempoolexplorer.backend.entities.block.Block;

public interface BlockFactory {

	Block from(GetBlockResultData blockResultData, boolean connected);

}
