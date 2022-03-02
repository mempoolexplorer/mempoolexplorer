package com.mempoolexplorer.backend.controllers.api;

import java.util.List;

import com.mempoolexplorer.backend.components.containers.igtxcache.IgTxCacheContainer;
import com.mempoolexplorer.backend.controllers.entities.transaction.TxIdTimesIgnored;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/ignoredTxAPI")
public class IgnoredTxAPIController {

    @Autowired
    private IgTxCacheContainer igTxCacheContainer;

    @GetMapping("/ignoredTxs/{algo}")
    public List<TxIdTimesIgnored> hasBlock(@PathVariable("algo") AlgorithmType aType) {
        return igTxCacheContainer.getIgTxList(aType);
    }
}
