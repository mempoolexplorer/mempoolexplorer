package com.mempoolexplorer.backend;

import javax.annotation.PreDestroy;

import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;
import com.mempoolexplorer.backend.threads.MainThread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
// @Profile(value = { AppProfiles.DEV, AppProfiles.PROD })
public class AppLifeCycle implements CommandLineRunner {

    @Autowired
    private MainThread mainThread;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private MongoMappingContext mongoMappingContext;

    @PreDestroy
    public void finalization() {
        log.warn("CLOSING...");
        mainThread.finalization();
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("STARTING...");
        initIndicesAfterStartup();
        mainThread.start();
    }

    public void initIndicesAfterStartup() {
        IndexResolver resolver = new MongoPersistentEntityIndexResolver(mongoMappingContext);
        IndexOperations indexOps = mongoTemplate.indexOps(MinerNameToBlockHeight.class);
        resolver.resolveIndexFor(MinerNameToBlockHeight.class).forEach(indexOps::ensureIndex);
    }

}
