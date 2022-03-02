package com.mempoolexplorer.backend.repositories.reactive.custom;

import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;

import reactor.core.publisher.Flux;

public class CustomMinerNameToBlockHeightReactiveRepositoryImpl
		implements CustomMinerNameToBlockHeightReactiveRepository {

	@Autowired
	ReactiveMongoTemplate rmt;

	@Override
	public Flux<String> findDistinctMinerNames() {
		return rmt.query(MinerNameToBlockHeight.class).distinct("minerToBlock.minerName").as(String.class).all();
	}

}
