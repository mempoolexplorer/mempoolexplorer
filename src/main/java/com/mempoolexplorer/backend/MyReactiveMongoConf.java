package com.mempoolexplorer.backend;

import java.util.ArrayList;
import java.util.Collection;

import com.mempoolexplorer.backend.repositories.reactive.IgTransactionReactiveRepository;
import com.mongodb.ConnectionString;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractReactiveMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
@EnableReactiveMongoRepositories(basePackageClasses = { IgTransactionReactiveRepository.class })
class MyReactiveMongoConf extends AbstractReactiveMongoConfiguration {

	@Value("${spring.data.mongodb.uri}")
	private String connString;

	@Override
	public MongoClient reactiveMongoClient() {
		return MongoClients.create(connString);
	}

	@Override
	protected String getDatabaseName() {
		ConnectionString cs = new ConnectionString(connString);
		return cs.getDatabase();
	}

	@Override
	public boolean autoIndexCreation() {
		return false;// see AppLifeCyle.initIndicesAfterStartup
	}

	@Override
	protected Collection<String> getMappingBasePackages() {
		java.util.List<String> packages = new ArrayList<>(1);
		packages.add("com.mempoolexplorer.backend.repositories.entities");
		packages.add("com.mempoolexplorer.backend.entites");
		return packages;
	}

}
