package com.mempoolexplorer.backend.controllers.api;

import com.mempoolexplorer.backend.components.containers.price.BitcoinPriceContainer;
import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStats;
import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStatsEx;
import com.mempoolexplorer.backend.controllers.entities.IgnoringBlockStatsList;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;
import com.mempoolexplorer.backend.repositories.reactive.IgBlockReactiveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/ignoringBlocksAPI")
public class IgnoringBlocksAPIController {

        @Autowired
        private IgBlockReactiveRepository igBlockReactiveRepository;

        @Autowired
        private BitcoinPriceContainer bitcoinPriceContainer;

        @GetMapping("/lastIgnoringBlock/{algo}")
        public IgnoringBlockStatsEx getIgnoringBlockStatsEx(
                        @PathVariable("algo") AlgorithmType aType) {
                IgnoringBlockStatsEx ibse = igBlockReactiveRepository
                                .findByAlgorithmUsedOrderByDbKeyDesc(aType, PageRequest.of(0, 1))
                                .map(IgnoringBlockStatsEx::new).next().block();
                ibse.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
                return ibse;
        }

        @GetMapping("/ignoringBlock/{height}/{algo}")
        public IgnoringBlockStatsEx getIgnoringBlockStatsEx(@PathVariable("height") Integer height,
                        @PathVariable("algo") AlgorithmType aType) {
                IgnoringBlockStatsEx ibse = igBlockReactiveRepository.findById(IgnoringBlock.builDBKey(height, aType))
                                .map(IgnoringBlockStatsEx::new).block();
                ibse.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
                return ibse;
        }

        @GetMapping("/ignoringBlocks/{page}/{size}/{algo}")
        public IgnoringBlockStatsList getIgnoringBlocksby(@PathVariable("page") Integer page,
                        @PathVariable("size") Integer size, @PathVariable("algo") AlgorithmType aType) {
                IgnoringBlockStatsList ibsl = new IgnoringBlockStatsList();
                ibsl.setBtcPrice(bitcoinPriceContainer.getUSDPrice());
                ibsl.setIgnoringBlockStatsList(igBlockReactiveRepository
                                .findByAlgorithmUsedOrderByDbKeyDesc(aType, PageRequest.of(page, size))
                                .map(IgnoringBlockStats::new).collectList().block());
                return ibsl;
        }
}
