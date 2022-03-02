package com.mempoolexplorer.backend.repositories.reactive;

import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;

@Repository
public interface IgBlockReactiveRepository extends ReactiveMongoRepository<IgnoringBlock, String> {

    Flux<IgnoringBlock> findByAlgorithmUsedAndMinedBlockDataCoinBaseDataMinerNameOrderByDbKeyDesc(
            AlgorithmType algorithmUsed, String minerName, Pageable pageable);

    Flux<IgnoringBlock> findByAlgorithmUsedOrderByDbKeyDesc(AlgorithmType algorithmUsed, Pageable pageable);

}
