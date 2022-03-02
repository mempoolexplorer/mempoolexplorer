package com.mempoolexplorer.backend.threads;

import com.mempoolexplorer.backend.components.alarms.AlarmLogger;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * Interface that defines a ZMQ sequence event processor. As a producer or as a
 * consumer a ZMQSequenceEventProcessor shares a blockingQueue.
 */
@Slf4j
public abstract class StoppableThread implements Runnable {

    @Getter
    private boolean started = false;
    @Getter
    private boolean finished = false;
    private Thread thread = null;

    @Autowired
    protected AlarmLogger alarmLogger;

    protected abstract void doYourThing() throws InterruptedException;

    public void start() {
        if (finished) {
            log.error("This class only accepts only one start");
            return;
        }
        if (started) {
            log.info("Thread already started");
            return;
        }
        thread = new Thread(this);
        thread.start();
        started = true;
    }

    public void shutdown() {
        if (!started) {
            log.error("This class is not started yet!");
            return;
        }
        if (finished) {
            log.info("Thread already finished");
            return;
        }
        thread.interrupt();// In case thread is waiting for something.
        finished = true;
    }

    @Override
    public void run() {
        try {
            doYourThing();
        } catch (RuntimeException e) {
            log.error("", e);
            alarmLogger.addAlarm("Fatal error" + ExceptionUtils.getStackTrace(e));
        } catch (InterruptedException e) {
            log.info("Thread interrupted for shutdown.");
            log.debug("", e);
            Thread.currentThread().interrupt();// It doesn't care, just to avoid sonar complaining.
        }

    }

}
