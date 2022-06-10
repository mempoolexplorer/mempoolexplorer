package com.mempoolexplorer.backend.controllers.devops;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.mempoolexplorer.backend.controllers.entities.BlockHole;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.repositories.reactive.IgBlockReactiveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/searchForBlockHoles")
public class SearchForBlockHoles {

	@Autowired
	private IgBlockReactiveRepository igBlockReactiveRepository;

	@GetMapping("/search")
	public List<BlockHole> getBlockHoles() {
		List<BlockHole> bhList = new ArrayList<>();
		List<Integer> sList = igBlockReactiveRepository.findAll()
				.filter(ib -> ib.getAlgorithmUsed() == AlgorithmType.BITCOIND)
				.map(ib -> ib.getMinedBlockData().getHeight()).sort().collectList().block();

		if (sList.size() == 0 || sList.size() == 1)
			return bhList;

		Iterator<Integer> it = sList.iterator();
		int second = it.next();

		do {
			int first = second;
			second = it.next();

			if (first + 2 == second) {
				bhList.add(new BlockHole(first + 1));
			} else if (first + 1 != second) {
				bhList.add(new BlockHole(first + 1, second - 1));
			}
		} while (it.hasNext());

		return bhList;
	}

	@GetMapping("/listBlocks")
	public Flux<Integer> getBlockList() {
		return igBlockReactiveRepository.findAll()
				.filter(ib -> ib.getAlgorithmUsed() == AlgorithmType.BITCOIND)
				.map(ib -> ib.getMinedBlockData().getHeight()).sort();
	}
}
