package com.mempoolexplorer.backend.components.containers.igtxcache;

import java.util.List;

import com.mempoolexplorer.backend.controllers.entities.transaction.TxIdTimesIgnored;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;

public interface IgTxCacheContainer {

    public List<TxIdTimesIgnored> getIgTxList(AlgorithmType aType);

    public void calculate();
}
