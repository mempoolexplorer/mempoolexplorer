package com.mempoolexplorer.backend.repositories.reactive;

import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.ignored.IgnoredTxState;
import com.mempoolexplorer.backend.entities.ignored.RepudiatedTransaction;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import reactor.core.publisher.Flux;

@Repository
public interface RepudiatedTxReactiveRepository extends ReactiveMongoRepository<RepudiatedTransaction, String> {

    Flux<RepudiatedTransaction> findByaTypeOrderByTimeWhenShouldHaveBeenMinedDesc(AlgorithmType aType,
            Pageable pageable);

    Flux<RepudiatedTransaction> findByState(IgnoredTxState state);

}
