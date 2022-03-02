package com.mempoolexplorer.backend.threads;

import java.util.Optional;

import lombok.Value;

@Value
public class MempoolSeqEvent {
    String hash;// Tx or block hash
    MempoolEventEnum event;
    Optional<Integer> mempoolSequence;// empty for block events. Starting in 1
    int zmqSequence;// Starting in 0.
}
