package com.mempoolexplorer.backend;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.PreDestroy;

import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;
import com.mempoolexplorer.backend.threads.MainThread;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.index.ReactiveIndexOperations;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AppLifeCycle implements CommandLineRunner {

    @Autowired
    private MainThread mainThread;

    @Autowired
    private ReactiveMongoTemplate reactiveMongoTemplate;

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
        ReactiveIndexOperations indexOps = reactiveMongoTemplate.indexOps(MinerNameToBlockHeight.class);
        resolver.resolveIndexFor(MinerNameToBlockHeight.class).forEach(indexOps::ensureIndex);
    }

    @EventListener
    public void handleContextRefreshed(ContextRefreshedEvent event) {
        printActiveProperties((ConfigurableEnvironment) event.getApplicationContext().getEnvironment());
    }

    private void printActiveProperties(ConfigurableEnvironment env) {

        log.info("************************* ACTIVE APP PROPERTIES ******************************");

        List<MapPropertySource> propertySources = new ArrayList<>();

        env.getPropertySources().forEach(it -> {
            if (it instanceof MapPropertySource) {
                propertySources.add((MapPropertySource) it);
            }
        });

        propertySources.stream()
                .map(propertySource -> propertySource.getSource().keySet())
                .flatMap(Collection::stream)
                .distinct()
                .filter(key -> StringUtils.containsIgnoreCase(key, "bitcoind")
                        || StringUtils.containsIgnoreCase(key, "txmempool"))
                .sorted()
                .forEach(key -> {
                    try {
                        if (StringUtils.containsIgnoreCase(key, "bitcoind.password")) {
                            log.info(key + "=****");
                        } else if (StringUtils.containsIgnoreCase(key, "bitcoind.user")) {
                            log.info(key + "=****");
                        } else {
                            log.info(key + "=" + env.getProperty(key));
                        }
                    } catch (Exception e) {
                        log.warn("{} -> {}", key, e.getMessage());
                    }
                });
        log.info("******************************************************************************");
    }
}
