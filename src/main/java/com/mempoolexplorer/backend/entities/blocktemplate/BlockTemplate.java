package com.mempoolexplorer.backend.entities.blocktemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BinaryOperator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateResultData;
import com.mempoolexplorer.backend.utils.SysProps;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Slf4j
public class BlockTemplate {

	// Height of the bock to be mined with this template.
	private int height;
	private Map<String, BlockTemplateTx> blockTemplateTxMap = new ConcurrentHashMap<>();

	@JsonIgnore
	final BinaryOperator<BlockTemplateTx> txBuilderMergeFunction = (oldTx, newTx) -> {
		log.error("duplicated txId: {}, this shouldn't be happening", newTx.getTxId());
		return oldTx;
	};

	private BlockTemplate() {
	}

	public BlockTemplate(GetBlockTemplateResultData gbtrd) {
		if (gbtrd.getTransactions().size() == 0) {
			blockTemplateTxMap = new ConcurrentHashMap<>(SysProps.HM_INITIAL_CAPACITY_FOR_BLOCK);
		} else {
			blockTemplateTxMap = IntStream.range(0, gbtrd.getTransactions().size() - 1)
					.mapToObj(i -> new BlockTemplateTx(gbtrd.getTransactions().get(i), i))
					.collect(Collectors.toMap(BlockTemplateTx::getTxId, btTx -> btTx, txBuilderMergeFunction,
							() -> new ConcurrentHashMap<>(SysProps.HM_INITIAL_CAPACITY_FOR_BLOCK)));
		}
		this.height = gbtrd.getHeight();
	}

	public static BlockTemplate empty() {
		return new BlockTemplate();
	}

}
