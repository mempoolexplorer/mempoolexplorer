package com.mempoolexplorer.backend.components.containers.minernames;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.mempoolexplorer.backend.entities.MinerNameUnresolved;

import org.springframework.stereotype.Component;

@Component
public class MinerNamesUnresolvedContainerImpl implements MinerNamesUnresolvedContainer {

	private List<MinerNameUnresolved> minerNamesUnresolvedList = Collections.synchronizedList(new ArrayList<>());

	@Override
	public void addCoinBaseField(String coinBaseField, int blockHeight) {
		minerNamesUnresolvedList.add(new MinerNameUnresolved(coinBaseField, blockHeight));
	}

	@Override
	public List<MinerNameUnresolved> getMinerNamesUnresolvedList() {
		return minerNamesUnresolvedList;
	}

}
