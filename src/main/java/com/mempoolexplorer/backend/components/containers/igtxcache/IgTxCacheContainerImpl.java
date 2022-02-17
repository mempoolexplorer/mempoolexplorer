package com.mempoolexplorer.backend.components.containers.igtxcache;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import com.mempoolexplorer.backend.components.containers.mempool.TxMempoolContainer;
import com.mempoolexplorer.backend.controllers.entities.pruned.PrunedIgnoringBlock;
import com.mempoolexplorer.backend.controllers.entities.transaction.TxIdTimesIgnored;
import com.mempoolexplorer.backend.entities.algorithm.AlgorithmType;
import com.mempoolexplorer.backend.entities.transaction.Transaction;
import com.mempoolexplorer.backend.repositories.reactive.IgTransactionReactiveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class IgTxCacheContainerImpl implements IgTxCacheContainer {
    @Autowired
    private IgTransactionReactiveRepository igTxReactiveRepository;

    @Autowired
    private TxMempoolContainer txMemPool;

    private List<TxIdTimesIgnored> igTxListOurs = new ArrayList<>();// Our onBlockArrival algorithm
    private List<TxIdTimesIgnored> igTxListBT = new ArrayList<>();// Bitcoind block template

    @Override
    public void calculate() {
        igTxListBT = calculate(AlgorithmType.BITCOIND);
        igTxListOurs = calculate(AlgorithmType.OURS);
    }

    private List<TxIdTimesIgnored> calculate(AlgorithmType aType) {
        return igTxReactiveRepository.findAll().filter(igTx -> igTx.getAType() == aType)
                .map(igTx -> new TxIdTimesIgnored(igTx.getTxId(), Integer.valueOf(igTx.getIgnoringBlocks().size()),
                        getBiggestDeltaSec(igTx.getTxId(), igTx.getIgnoringBlocks())))
                .sort(Comparator.comparingInt(TxIdTimesIgnored::getNIgnored)
                        .thenComparing(TxIdTimesIgnored::getDeltaSec).reversed()
                        .thenComparing(TxIdTimesIgnored::getTxId))
                .collectList().block();
    }

    @Override
    public List<TxIdTimesIgnored> getIgTxList(AlgorithmType aType) {
        if (aType == AlgorithmType.OURS)
            return igTxListOurs;
        else
            return igTxListBT;
    }

    private long getBiggestDeltaSec(String txId, List<PrunedIgnoringBlock> pibList) {
        Optional<Transaction> opTx = txMemPool.getTx(txId);
        if (opTx.isEmpty() || pibList.isEmpty())
            return 0;
        PrunedIgnoringBlock pigB = pibList.get(pibList.size() - 1);
        return (pigB.getTime() / 1000) - opTx.get().getTimeInSecs();
    }
}
