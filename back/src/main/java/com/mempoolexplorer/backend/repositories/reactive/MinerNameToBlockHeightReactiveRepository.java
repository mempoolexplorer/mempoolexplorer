package com.mempoolexplorer.backend.repositories.reactive;

import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;
import com.mempoolexplorer.backend.repositories.reactive.custom.CustomMinerNameToBlockHeightReactiveRepository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;

@Repository
public interface MinerNameToBlockHeightReactiveRepository extends
		ReactiveMongoRepository<MinerNameToBlockHeight, String>, CustomMinerNameToBlockHeightReactiveRepository {

	Flux<MinerNameToBlockHeight> findTop20ByMinerToBlockMinerNameOrderByMedianMinedTimeDesc(String minerName);

}
