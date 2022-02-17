package com.mempoolexplorer.backend.repositories.reactive.custom;

import reactor.core.publisher.Flux;

public interface CustomMinerNameToBlockHeightReactiveRepository {

	Flux<String> findDistinctMinerNames();
}
