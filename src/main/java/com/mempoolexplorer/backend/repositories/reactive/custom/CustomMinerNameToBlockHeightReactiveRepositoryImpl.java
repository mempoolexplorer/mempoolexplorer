package com.mempoolexplorer.backend.repositories.reactive.custom;

import java.util.List;

import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

public class CustomMinerNameToBlockHeightReactiveRepositoryImpl
		implements CustomMinerNameToBlockHeightReactiveRepository {

	@Autowired
	MongoTemplate mt;

	@Override
	public List<String> findDistinctMinerNames() {
		return mt.query(MinerNameToBlockHeight.class).distinct("minerToBlock.minerName").as(String.class).all();
	}

}
