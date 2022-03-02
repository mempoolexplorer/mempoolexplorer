package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.entities.transaction.Transaction;
import com.mempoolexplorer.backend.entities.transaction.TxAncestry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * MiningQueue is a one-shot class. Is expected to be created one time and
 * queryied many, until a new one is created due to mempool refreshing.
 * 
 * NOTE: We use the words "parent(s)" or "ancestor(s)" equally
 * 
 * MiningQueue is created using the mempool's txs stream ordered by descending
 * sat/vByte INCLUDING TX'S ANCESTORS. (This is used for CPFP or Child Pays For
 * Parent)
 * 
 * Ancestors of a paying tx (CPFP) are put before paying tx child. then paying
 * tx child is inserted. This ensures an almost descending MiningQueue by
 * satVByte
 * 
 * Childrens of an already inserted parent tx must have different sat/vByte
 * INCLUDING TX'S ANCESTORS since some of them are already included. We use the
 * class ModifiedMempool to store that fees and weigth reduction since tx in
 * mempool must not be mutated.
 * 
 * Constructor uses a coinBaseVSizeList, which is a template of blocks with that
 * coinbaseVSize. More CandidateBlocks could be created up to maxNumBlocks.
 * 
 */
public class MiningQueue {
	private static Logger logger = LoggerFactory.getLogger(MiningQueue.class);

	// This is the block list.
	private ArrayList<CandidateBlock> blockList = new ArrayList<>();
	private int maxNumBlocks = 0;
	private double lastSatVByte = Double.MAX_VALUE;
	private boolean hadErrors = false;
	// This maps doubles this class size but enable fast lookups.
	private Map<String, TxToBeMined> globalTxsMap = new HashMap<>();

	private ModifiedMempool modifiedMempool = new ModifiedMempool();

	private TxMempoolContainer txMemPool;

	private Transaction txIFLDG = null;// tx in first longest dependency graph;

	private String fancyTxId = null;// usually a transaction with a graph not too big.

	private TxGraphList txGraphList = new TxGraphList();

	private MiningQueue() {
	}

	public static MiningQueue buildFrom(List<Integer> coinBaseTxWeightList, TxMempoolContainer txMemPool,
			Integer maxTransactionsNumber, Integer maxNumBlocks, Integer maxTxsToCalculateTxsGraphs) {
		logger.info("Creating new MiningQueue...");
		MiningQueue mq = new MiningQueue();
		mq.txMemPool = txMemPool;
		mq.maxNumBlocks = Math.max(coinBaseTxWeightList.size(), maxNumBlocks);
		for (int index = 0; index < coinBaseTxWeightList.size(); index++) {
			mq.blockList.add(new CandidateBlock(index, coinBaseTxWeightList.get(index)));
		}
		int mempoolsize = txMemPool.getTxNumber();
		txMemPool.getDescendingTxStream().limit(maxTransactionsNumber).forEach(tx -> {
			mq.addTx(tx);
			mq.checkFLDG(tx);// Checks first tx found in first longest dependency graph
			if ((mempoolsize < maxTxsToCalculateTxsGraphs) && (maxNumBlocks != 1)) {
				mq.addToTxGraph(tx);
			}
			checkIsDescending(tx, mq);
		});
		mq.getTxGraphList().sort();
		mq.calculateFancyTx();
		calculatePrecedingTxsCount(mq);
		logger.info("New MiningQueue created.");
		return mq;
	}

	public boolean isHadErrors() {
		return hadErrors;
	}

	// Checks if txMemPool is giving txs in descending order
	private static void checkIsDescending(Transaction tx, MiningQueue mq) {
		if (tx.getSatvByteIncludingAncestors() > mq.lastSatVByte) {
			mq.hadErrors = true;
		} else {
			mq.lastSatVByte = tx.getSatvByteIncludingAncestors();
		}
	}

	// Checks first tx found in first longest dependency graph
	private void checkFLDG(Transaction tx) {
		if (txIFLDG == null) {
			txIFLDG = tx;
			return;
		}
		int currentDepth = txIFLDG.getTxAncestry().getAncestorCount() + txIFLDG.getTxAncestry().getDescendantCount();
		int txDepth = tx.getTxAncestry().getAncestorCount() + tx.getTxAncestry().getDescendantCount();
		if (txDepth > currentDepth) {
			txIFLDG = tx;
		}
	}

	private void calculateFancyTx() {
		Iterator<TxGraph> it = txGraphList.getTxsGraphList().iterator();
		while (it.hasNext()) {
			TxGraph graph = it.next();
			if (graph.isNonLinear() && graph.getTxSet().size() < 20) {
				fancyTxId = graph.getTxSet().iterator().next();
				break;
			}
		}
		if ((fancyTxId == null) && (txIFLDG != null)) {
			fancyTxId = txIFLDG.getTxId();
		}
	}

	private void addToTxGraph(Transaction tx) {
		TxAncestry ancestry = tx.getTxAncestry();
		if ((ancestry.getAncestorCount() + ancestry.getDescendantCount()) == 2)
			return;
		txGraphList.add(tx);
	}

	private static void calculatePrecedingTxsCount(MiningQueue mq) {
		int txCount = 0;
		for (CandidateBlock block : mq.blockList) {
			block.setPrecedingTxsCount(txCount);
			txCount += block.numTxs();
		}
	}

	public Stream<TxToBeMined> getGlobalTxStream() {
		return globalTxsMap.values().stream();
	}

	public static MiningQueue empty() {
		return new MiningQueue();
	}

	public int getNumTxs() {
		return globalTxsMap.size();
	}

	public int getNumCandidateBlocks() {
		return blockList.size();
	}

	// Checks first tx found in first longest dependency graph
	public Transaction getTxIFLDG() {
		return txIFLDG;
	}

	// Normally a tx within a graph not too big.
	public String getFancyTxId() {
		return fancyTxId;
	}

	public TxGraphList getTxGraphList() {
		return txGraphList;
	}

	public Optional<CandidateBlock> getCandidateBlock(int index) {
		if (index < blockList.size()) {
			return Optional.of(blockList.get(index));
		}
		return Optional.empty();
	}

	// searches for a TxToBeMined
	public Optional<TxToBeMined> getTxToBeMined(String txId) {
		return Optional.ofNullable(globalTxsMap.get(txId));
	}

	public boolean contains(String txId) {
		return (globalTxsMap.get(txId) != null);
	}

	// tx comes ordered in descending Sat/vByte including ancestors
	private void addTx(Transaction tx) {

		if (modifiedMempool.contains(tx.getTxId())) {
			// This tx is in modifiedMempool with fees and weigh updated.
			return;
		}
		Optional<ModifiedTx> bestThan = modifiedMempool.getBestThan(tx);
		while (bestThan.isPresent()) {
			addTxWithParents(bestThan.get().getTx(), bestThan.get().getRealAncestorSatVByte());
			modifiedMempool.remove(bestThan.get().getTx().getTxId());

			if (modifiedMempool.contains(tx.getTxId())) {
				// This tx is in modifiedMempool with fees and weigh updated.
				// Not sure if this code is recheable but feels safer.
				return;
			}

			bestThan = modifiedMempool.getBestThan(tx);
		}
		addTxWithParents(tx, tx.getSatvByteIncludingAncestors());
	}

	private void addTxWithParents(Transaction tx, double realSatVByte) {

		if (contains(tx.getTxId())) {
			// This tx is another's parent that has been yet included in a block. Ignore it
			return;
		}

		Set<String> allParentsOfTx = txMemPool.getAllParentsOf(tx);// Excluding itself
		Set<String> childrenSet = txMemPool.getAllChildrenOf(tx);// Excluding itself

		List<Transaction> notInAnyBlockParents = getNotInAnyCandidateBlockTxListOf(allParentsOfTx);
		List<Transaction> notInAnyBlockChildrens = getNotInAnyCandidateBlockTxListOf(childrenSet);

		int notInAnyBlockParentsSumWeight = notInAnyBlockParents.stream().mapToInt(trx -> trx.getWeight()).sum();
		long notInAnyBlockParentsSumFee = notInAnyBlockParents.stream().mapToLong(trx -> trx.getBaseFees()).sum();

		int txEffectiveWeightInCurrentBlock = tx.getWeight() + notInAnyBlockParentsSumWeight;

		Optional<CandidateBlock> blockToFill = getCandidateBlockToFill(txEffectiveWeightInCurrentBlock, allParentsOfTx);

		if (blockToFill.isPresent()) {
			notInAnyBlockParents.stream().forEach(trx -> {
				TxToBeMined txToBeMined = blockToFill.get().addTx(trx, Optional.of(tx),
						optionalList(notInAnyBlockChildrens), realSatVByte);
				globalTxsMap.put(trx.getTxId(), txToBeMined);

			});
			TxToBeMined txToBeMined = blockToFill.get().addTx(tx, Optional.empty(),
					optionalList(notInAnyBlockChildrens), realSatVByte);
			globalTxsMap.put(tx.getTxId(), txToBeMined);

			// Only if tx is really added
			modifiedMempool.substractParentDataToChildren(notInAnyBlockChildrens,
					tx.getBaseFees() + notInAnyBlockParentsSumFee, tx.getWeight() + notInAnyBlockParentsSumWeight);
		}
	}

	private Optional<List<Transaction>> optionalList(List<Transaction> txList) {
		if (txList == null || txList.isEmpty()) {
			return Optional.empty();
		}
		return Optional.of(txList);
	}

	private Optional<CandidateBlock> getCandidateBlockToFill(int effectiveWeight, Set<String> allParentsOfTx) {
		List<TxToBeMined> parentTxsAlreadyInABlockList = getInAnyCandidateBlockTxListOf(allParentsOfTx);
		Iterator<CandidateBlock> it = blockList.iterator();
		while (it.hasNext()) {
			CandidateBlock block = it.next();
			if (block.getFreeSpace() >= effectiveWeight) {
				// We cannot put a Tx if any of its parents is mined in a block after this one
				if (notAnyTxAfterCandidateBlockIndex(block.getIndex(), parentTxsAlreadyInABlockList)) {
					return Optional.of(block);
				}
			}
		}
		return createOrEmpty();
	}

	private Optional<CandidateBlock> createOrEmpty() {
		if (blockList.size() < maxNumBlocks) {
			CandidateBlock cb = new CandidateBlock(blockList.size(), 0);
			blockList.add(cb);
			return Optional.of(cb);
		}
		return Optional.empty();
	}

	// return true if there is no TxToBeMined in txToBeMinedList which is going to
	// be mined in a block after blockPosition
	private boolean notAnyTxAfterCandidateBlockIndex(int blockIndex, List<TxToBeMined> parentTxsAlreadyInABlockList) {
		for (TxToBeMined txToBeMined : parentTxsAlreadyInABlockList) {
			if (txToBeMined.getContainingBlock().getIndex() > blockIndex) {
				return false;
			}
		}
		return true;
	}

	// Returns the list of txs that are in {@value txIdSet} but not are in
	// any CandidateBlock
	private List<Transaction> getNotInAnyCandidateBlockTxListOf(Set<String> txIdSet) {
		return txIdSet.stream().filter(txId -> !contains(txId)).map(txId -> txMemPool.getTx(txId))
				.flatMap(Optional::stream).collect(Collectors.toList());
	}

	// Returns the list of txs that are in {@value allParentsOfTx} and in any
	// CandidateBlock
	private List<TxToBeMined> getInAnyCandidateBlockTxListOf(Set<String> allParentsOfTx) {
		return allParentsOfTx.stream().map(txId -> getTxToBeMined(txId)).flatMap(Optional::stream)
				.collect(Collectors.toList());
	}

}
