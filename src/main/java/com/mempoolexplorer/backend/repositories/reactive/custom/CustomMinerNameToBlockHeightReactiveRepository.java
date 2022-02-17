package com.mempoolexplorer.backend.repositories.reactive.custom;

import java.util.List;

public interface CustomMinerNameToBlockHeightReactiveRepository {

	List<String> findDistinctMinerNames();
}
