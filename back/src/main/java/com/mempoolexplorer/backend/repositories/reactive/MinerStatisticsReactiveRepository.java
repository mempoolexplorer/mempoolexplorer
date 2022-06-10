package com.mempoolexplorer.backend.repositories.reactive;

import com.mempoolexplorer.backend.repositories.entities.MinerStatistics;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;

@Repository
public interface MinerStatisticsReactiveRepository extends ReactiveMongoRepository<MinerStatistics, String> {

	Flux<MinerStatistics> findAllByOrderByAvgLostRewardGBTDesc();

	Flux<MinerStatistics> findAllByOrderByAvgLostRewardOBADesc();

}
