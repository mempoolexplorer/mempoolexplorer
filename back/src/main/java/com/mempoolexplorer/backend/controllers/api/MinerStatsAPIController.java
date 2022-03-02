package com.mempoolexplorer.backend.controllers.api;

import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStats;
import com.mempoolexplorer.backend.controllers.entities.MinerStats;
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

import reactor.core.publisher.Flux;

@CrossOrigin
@RestController
@RequestMapping("/minersStatsAPI")
public class MinerStatsAPIController {

    @Autowired
    private MinerStatisticsReactiveRepository minerStatisticsRepository;

    @Autowired
    private IgBlockReactiveRepository igBlockReactiveRepository;

    @GetMapping("/historicStats")
    public Flux<MinerStats> getMinersStats() {
        return minerStatisticsRepository.findAll().map(MinerStats::new);
    }

    @GetMapping("/ignoringBlocks/{minerName}/{page}/{size}/{algo}")
    public Flux<IgnoringBlockStats> getIgnoringBlocks(@PathVariable("minerName") String minerName,
            @PathVariable("page") Integer page, @PathVariable("size") Integer size,
            @PathVariable("algo") AlgorithmType aType) {
        return igBlockReactiveRepository.findByAlgorithmUsedAndMinedBlockDataCoinBaseDataMinerNameOrderByDbKeyDesc(
                aType, minerName, PageRequest.of(page, size)).map(IgnoringBlockStats::new);
    }
}
