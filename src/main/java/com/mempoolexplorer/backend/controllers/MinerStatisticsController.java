package com.mempoolexplorer.backend.controllers;

import com.mempoolexplorer.backend.controllers.errors.ErrorDetails;
import com.mempoolexplorer.backend.controllers.exceptions.AlgorithmTypeNotFoundException;
import com.mempoolexplorer.backend.controllers.exceptions.MinerNameNotFoundException;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.repositories.entities.MinerNameToBlockHeight;
import com.mempoolexplorer.backend.repositories.entities.MinerStatistics;
import com.mempoolexplorer.backend.repositories.reactive.MinerNameToBlockHeightReactiveRepository;
import com.mempoolexplorer.backend.repositories.reactive.MinerStatisticsReactiveRepository;
import com.mempoolexplorer.backend.utils.SysProps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/minerStatistics")
public class MinerStatisticsController {

	@Autowired
	private MinerNameToBlockHeightReactiveRepository minerNameToBlockHeightRepository;

	@Autowired
	private MinerStatisticsReactiveRepository minerStatisticsRepository;

	@GetMapping("/minerNames")
	public Flux<String> getMinerNames() {
		return minerNameToBlockHeightRepository.findDistinctMinerNames();
	}

	@GetMapping("/{minerName}")
	public Mono<MinerStatistics> getMinerStatistics(@PathVariable("minerName") String minerName)
			throws MinerNameNotFoundException {
		return minerStatisticsRepository.findById(minerName.toLowerCase())
				.switchIfEmpty(Mono.error(new MinerNameNotFoundException("Miner name:" + minerName + " not found.")));
	}

	@GetMapping("/global")
	public Mono<MinerStatistics> getGlobalMinerStatistics() throws MinerNameNotFoundException {
		return minerStatisticsRepository.findById(SysProps.GLOBAL_MINER_NAME)
				.switchIfEmpty(Mono.error(new MinerNameNotFoundException("Global miner statistics not found.")));

	}

	@GetMapping("/byLostReward/{algo}")
	public Flux<MinerStatistics> getMinerStatisticsByLostRewardBy(@PathVariable("algo") String algo)
			throws AlgorithmTypeNotFoundException {
		AlgorithmType algorithmType;
		try {
			algorithmType = AlgorithmType.valueOf(algo);
		} catch (RuntimeException e) {
			throw new AlgorithmTypeNotFoundException("Algorithm " + algo + " not found");
		}
		if (algorithmType == AlgorithmType.BITCOIND) {
			return minerStatisticsRepository.findAllByOrderByTotalLostRewardBTPerBlockDesc();
		} else {
			return minerStatisticsRepository.findAllByOrderByTotalLostRewardCBPerBlockDesc();
		}
	}

	@GetMapping("/last20BlocksOf/{minerName}")
	public Flux<MinerNameToBlockHeight> getLastBlocksOfMiner(@PathVariable("minerName") String minerName) {
		return minerNameToBlockHeightRepository.findTop20ByMinerToBlockMinerNameOrderByMedianMinedTimeDesc(minerName);
	}

	@ExceptionHandler(MinerNameNotFoundException.class)
	public ResponseEntity<ErrorDetails> onMinerNameNotFound(MinerNameNotFoundException e) {
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setErrorMessage(e.getMessage());
		errorDetails.setErrorCode(HttpStatus.NOT_FOUND.toString());
		return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(MinerNameNotFoundException.class)
	public ResponseEntity<ErrorDetails> onAlgorithmTypeNotFound(AlgorithmTypeNotFoundException e) {
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setErrorMessage(e.getMessage());
		errorDetails.setErrorCode(HttpStatus.NOT_FOUND.toString());
		return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
	}

}
