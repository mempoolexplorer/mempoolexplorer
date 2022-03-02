package com.mempoolexplorer.backend.repositories.reactive;

import com.mempoolexplorer.backend.entities.ignored.IgnoredTransaction;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IgTransactionReactiveRepository extends ReactiveMongoRepository<IgnoredTransaction, String> {

}
