package com.mempoolexplorer.backend;

import javax.annotation.PreDestroy;

import com.mempoolexplorer.backend.threads.MainThread;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
// @Profile(value = { AppProfiles.DEV, AppProfiles.PROD })
public class AppLifeCycle implements CommandLineRunner {

    @Autowired
    private MainThread mainThread;

    @PreDestroy
    public void finalization() {
        log.warn("CLOSING...");
        mainThread.finalization();
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("STARTING...");
        mainThread.start();
    }

}
