package com.mempoolexplorer.backend.controllers.entities;

import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;

import lombok.Getter;

@Getter
public class IgnoringBlockStatsEx extends IgnoringBlockStats {
        private StatsData relayedToUs;
        private StatsData ignoredONRByMiner;
        private StatsData ignoredByUs;
        private StatsData notRelayedToUs;
        private StatsData inCommon;
        private StatsData minedBlock;
        private StatsData candidateBlock;
        private StatsData mempool;

        public IgnoringBlockStatsEx(IgnoringBlock igBlock) {
                super(igBlock);
                this.relayedToUs = new StatsData(igBlock.getRelayedToUsData());
                this.ignoredONRByMiner = new StatsData(igBlock.getIgnoredONRByMinerData());
                this.ignoredByUs = new StatsData(igBlock.getIgnoredByUsData());
                this.notRelayedToUs = new StatsData(igBlock.getNotRelayedTousData());
                this.inCommon = new StatsData(igBlock.getInCommonData());
                this.minedBlock = new StatsData(igBlock.getMinedBlockData().getFeeableData());
                this.candidateBlock = new StatsData(igBlock.getCandidateBlockData().getFeeableData());
                this.mempool = new StatsData(igBlock.getTxMempoolStats().getNumTxs(),
                                igBlock.getTxMempoolStats().getTotalWeight(),
                                igBlock.getTxMempoolStats().getTotalFees());
        }

}
