package com.mempoolexplorer.backend.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.mempoolexplorer.backend.components.containers.liveminingqueue.LiveMiningQueueContainer;
import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.controllers.entities.CompleteLiveMiningQueueGraphData;
import com.mempoolexplorer.backend.controllers.entities.transaction.TxInQueue;
import com.mempoolexplorer.backend.controllers.errors.ErrorDetails;
import com.mempoolexplorer.backend.controllers.exceptions.BlockNotFoundException;
import com.mempoolexplorer.backend.controllers.exceptions.ServiceNotReadyYetException;
import com.mempoolexplorer.backend.controllers.exceptions.TransactionNotFoundException;
import com.mempoolexplorer.backend.entities.CandidateBlockData;
import com.mempoolexplorer.backend.entities.fees.FeeableData;
import com.mempoolexplorer.backend.entities.miningqueue.CandidateBlock;
import com.mempoolexplorer.backend.entities.miningqueue.LiveMiningQueue;
import com.mempoolexplorer.backend.entities.miningqueue.MiningQueue;
import com.mempoolexplorer.backend.entities.miningqueue.TxToBeMined;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/liveMiningQueue")
public class LiveMiningQueueController {

	@Autowired
	private LiveMiningQueueContainer liveMiningQueueContainer;

	@Autowired
	private TxMempoolContainer txMemPool;

	@GetMapping("/graphicData")
	public CompleteLiveMiningQueueGraphData getGraphicData() throws ServiceNotReadyYetException {
		if (liveMiningQueueContainer.atomicGet() == null) {
			throw new ServiceNotReadyYetException();
		}
		return liveMiningQueueContainer.atomicGet().getLiveMiningQueueGraphData();
	}

	@GetMapping("/tx/{txId}")
	public TxInQueue getTxInQueue(@PathVariable("txId") String txId)
			throws TransactionNotFoundException, ServiceNotReadyYetException {
		if (liveMiningQueueContainer.atomicGet() == null) {
			throw new ServiceNotReadyYetException();
		}
		MiningQueue miningQueue = liveMiningQueueContainer.atomicGet().getMiningQueue();

		Optional<TxToBeMined> txToBeMined = miningQueue.getTxToBeMined(txId);
		if (txToBeMined.isEmpty()) {
			Optional<Transaction> tx = txMemPool.getTx(txId);
			if (tx.isEmpty()) {
				throw new TransactionNotFoundException("txId: " + txId + " not found.");
			} else {
				// Client must use satVByte to guess an aproximate position
				return new TxInQueue(tx.get(), TxInQueue.UNKNOWN_POSITION);
			}
		} else {
			CandidateBlock containingBlock = txToBeMined.get().getContainingBlock();
			int positionInQueue = containingBlock.getPrecedingTxsCount() + txToBeMined.get().getPositionInBlock();
			return new TxInQueue(txToBeMined.get().getTx(), positionInQueue);
		}
	}

	@GetMapping("/candidateBlock/{index}")
	public CandidateBlockData getCandidateBlockData(@PathVariable("index") int index) throws BlockNotFoundException {
		Optional<CandidateBlock> candidateBlock = liveMiningQueueContainer.atomicGet().getMiningQueue()
				.getCandidateBlock(index);
		if (candidateBlock.isEmpty()) {
			throw new BlockNotFoundException("Candidate block with index: " + index + " not found");
		}
		return new CandidateBlockData(candidateBlock.get(), null);
	}

	@GetMapping("/candidateBlockWithStats/{index}")
	public CandidateBlockData getCandidateBlockDataWithStats(@PathVariable("index") int index)
			throws BlockNotFoundException {
		Optional<CandidateBlock> candidateBlock = liveMiningQueueContainer.atomicGet().getMiningQueue()
				.getCandidateBlock(index);
		if (candidateBlock.isEmpty()) {
			throw new BlockNotFoundException("Candidate block with index: " + index + " not found");
		}
		FeeableData feeableData = new FeeableData();
		feeableData.checkFees(candidateBlock.get().getOrderedStream());
		return new CandidateBlockData(candidateBlock.get(), feeableData);
	}

	@GetMapping("/txsWithPayingChildren")
	public List<String> getTxsWithPayingChildren() {
		LiveMiningQueue mq = liveMiningQueueContainer.atomicGet();
		return mq.getMiningQueue().getGlobalTxStream().filter(txtbm -> {
			return txtbm.getPayingChildTx().isPresent();
		}).map(TxToBeMined::getTxId).collect(Collectors.toList());
	}

	@ExceptionHandler(BlockNotFoundException.class)
	public ResponseEntity<?> onBlockNotFound(BlockNotFoundException e) {
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setErrorMessage(e.getMessage());
		errorDetails.setErrorCode(HttpStatus.NOT_FOUND.toString());
		return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(TransactionNotFoundException.class)
	public ResponseEntity<?> onTransactionNotFound(TransactionNotFoundException e) {
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setErrorMessage(e.getMessage());
		errorDetails.setErrorCode(HttpStatus.NOT_FOUND.toString());
		return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ServiceNotReadyYetException.class)
	public ResponseEntity<?> onServiceNotReadyYet(ServiceNotReadyYetException e) {
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setErrorMessage(e.getMessage());
		errorDetails.setErrorCode(HttpStatus.SERVICE_UNAVAILABLE.toString());
		return new ResponseEntity<>(errorDetails, HttpStatus.SERVICE_UNAVAILABLE);
	}

}
