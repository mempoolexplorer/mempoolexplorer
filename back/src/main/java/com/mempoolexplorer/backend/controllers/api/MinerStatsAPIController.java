package com.mempoolexplorer.backend.controllers.api;

import com.mempoolexplorer.backend.components.containers.price.BitcoinPriceContainer;
import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStats;
import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStatsList;
import com.mempoolexplorer.backend.controllers.entities.MinerStats;
import com.mempoolexplorer.backend.controllers.entities.MinerStatsList;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.repositories.reactive.IgBlockReactiveRepository;
import com.mempoolexplorer.backend.repositories.reactive.MinerStatisticsReactiveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/minersStatsAPI")
public class MinerStatsAPIController {

    @Autowired
    private MinerStatisticsReactiveRepository minerStatisticsRepository;

    @Autowired
    private IgBlockReactiveRepository igBlockReactiveRepository;

    @Autowired
    private BitcoinPriceContainer bitcoinPriceContainer;

    @GetMapping("/historicStats")
    public MinerStatsList getMinersStats() {
        MinerStatsList msl = new MinerStatsList();
        msl.setMinerStatsList(minerStatisticsRepository.findAll().map(MinerStats::new).collectList().block());
        msl.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
        return msl;
    }

    @GetMapping("/ignoringBlocks/{minerName}/{page}/{size}/{algo}")
    public IgnoringBlockStatsList getIgnoringBlocks(@PathVariable("minerName") String minerName,
            @PathVariable("page") Integer page, @PathVariable("size") Integer size,
            @PathVariable("algo") AlgorithmType aType) {
        IgnoringBlockStatsList ibsl = new IgnoringBlockStatsList();
        ibsl.setIgnoringBlockStatsList(
                igBlockReactiveRepository.findByAlgorithmUsedAndMinedBlockDataCoinBaseDataMinerNameOrderByDbKeyDesc(
                        aType, minerName, PageRequest.of(page, size)).map(IgnoringBlockStats::new).collectList()
                        .block());
        ibsl.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
        return ibsl;
    }
}
