package com.mempoolexplorer.backend.components.containers.algorithm;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.mempoolexplorer.backend.entities.algorithm.AlgorithmDiff;
import com.mempoolexplorer.backend.properties.TxMempoolProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AlgorithmDiffContainerImpl implements AlgorithmDiffContainer {

	@Autowired
	private TxMempoolProperties txMempoolProperties;

	private Map<Integer, AlgorithmDiff> heightToAlgoDiffMap = new ConcurrentHashMap<>();
	private AtomicReference<AlgorithmDiff> last = new AtomicReference<>();

	@Override
	public void put(AlgorithmDiff algoDiff) {
		last.set(algoDiff);
		heightToAlgoDiffMap.put(algoDiff.getBlockHeight(), algoDiff);

		if (null != last.get()) {
			List<Integer> toRemoveList = heightToAlgoDiffMap.values().stream()
					.filter(ad -> ad.getBlockHeight() > (last.get().getBlockHeight()
							- txMempoolProperties.getMaxLiveDataBufferSize()))
					.map(AlgorithmDiff::getBlockHeight).collect(Collectors.toList());

			toRemoveList.stream().forEach(height -> heightToAlgoDiffMap.remove(height));
		}
	}

	@Override
	public Map<Integer, AlgorithmDiff> getHeightToAlgoDiffMap() {
		return heightToAlgoDiffMap;
	}

	@Override
	public Optional<AlgorithmDiff> getLast() {
		return Optional.ofNullable(last.get());
	}

	@Override
	public void drop() {
		heightToAlgoDiffMap = new ConcurrentHashMap<>();
		last = new AtomicReference<>();
	}
}
