package com.mempoolexplorer.backend.controllers.api;

import com.mempoolexplorer.backend.components.containers.price.BitcoinPriceContainer;
import com.mempoolexplorer.backend.controllers.entities.RepudiatedTransactionList;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.repositories.reactive.RepudiatedTxReactiveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/repudiatedTxAPI")
public class RepudiatedTxAPIController {

    @Autowired
    private RepudiatedTxReactiveRepository repudiatedTxReactiveRepository;

    @Autowired
    private BitcoinPriceContainer bitcoinPriceContainer;

    @GetMapping("/repudiatedTxs/{page}/{size}/{algo}")
    public RepudiatedTransactionList getIgnoringBlocksby(@PathVariable("page") Integer page,
            @PathVariable("size") Integer size, @PathVariable("algo") AlgorithmType aType) {
        RepudiatedTransactionList rtl = new RepudiatedTransactionList();
        rtl.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
        rtl.setRepudiatedTxs(repudiatedTxReactiveRepository.findByaTypeOrderByTimeWhenShouldHaveBeenMinedDesc(aType,
                PageRequest.of(page, size)).collectList().block());
        return rtl;
    }
}
