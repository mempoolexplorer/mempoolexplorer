package com.mempoolexplorer.backend.components.containers.minernames;

import java.util.List;

import com.mempoolexplorer.backend.entities.MinerNameUnresolved;

public interface MinerNamesUnresolvedContainer {

	List<MinerNameUnresolved> getMinerNamesUnresolvedList();

	void addCoinBaseField(String coinBaseField, int blockHeight);

}
