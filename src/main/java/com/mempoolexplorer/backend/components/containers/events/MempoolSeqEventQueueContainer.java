package com.mempoolexplorer.backend.components.containers.events;

import java.util.concurrent.BlockingQueue;

import com.mempoolexplorer.backend.threads.MempoolSeqEvent;

public interface MempoolSeqEventQueueContainer {

    BlockingQueue<MempoolSeqEvent> getBlockingQueue();

}
