package com.mempoolexplorer.backend.components.containers.events;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import com.mempoolexplorer.backend.threads.MempoolSeqEvent;

import org.springframework.stereotype.Component;

@Component
public class MempoolSeqEventQueueContainerImpl implements MempoolSeqEventQueueContainer {

    BlockingQueue<MempoolSeqEvent> blockingQueue = new LinkedBlockingQueue<>();

    @Override
    public BlockingQueue<MempoolSeqEvent> getBlockingQueue() {
        return this.blockingQueue;
    }
}
