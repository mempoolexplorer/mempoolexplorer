package com.mempoolexplorer.backend.components.containers.algorithm;

import java.util.Map;
import java.util.Optional;

import com.mempoolexplorer.backend.entities.algorithm.AlgorithmDiff;

public interface AlgorithmDiffContainer {

	void put(AlgorithmDiff ad);

	Map<Integer, AlgorithmDiff> getHeightToAlgoDiffMap();

	Optional<AlgorithmDiff> getLast();

	void drop();
}
