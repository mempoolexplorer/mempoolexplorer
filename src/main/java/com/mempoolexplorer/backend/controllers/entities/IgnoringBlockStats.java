package com.mempoolexplorer.backend.controllers.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IgnoringBlockStats {
    @JsonProperty("h")
    private int height;
    @JsonProperty("nInMB")
    private int txsInMinedBlock;
    @JsonProperty("nInCB")
    private int txsInCandidateBlock;
    @JsonProperty("t")
    private long time;
    @JsonProperty("mn")
    private String minerName;
    @JsonProperty("lr")
    private long lostReward;
    @JsonProperty("lreNIM")
    private long lostRewardExcludingNotInMempoolTx;
    @JsonProperty("nInMP")
    private int numTxInMempoolWhenMined;
    @JsonProperty("cb")
    private String coinbaseFieldAscii;

    public IgnoringBlockStats(IgnoringBlock igBlock) {
        this.setHeight(igBlock.getMinedBlockData().getHeight());
        this.setLostReward(igBlock.getLostReward());
        this.setLostRewardExcludingNotInMempoolTx(igBlock.getLostRewardExcludingNotInMempoolTx());
        this.setMinerName(igBlock.getMinedBlockData().getCoinBaseData().getMinerName());
        this.setNumTxInMempoolWhenMined(igBlock.getTxMempoolStats().getNumTxs());
        this.setTime(igBlock.getMinedBlockData().getMinedTime().toEpochMilli());
        this.setTxsInCandidateBlock(igBlock.getCandidateBlockData().getNumTxs());
        this.setTxsInMinedBlock(igBlock.getMinedBlockData().getFeeableData().getNumTxs().orElse(0));
        this.setCoinbaseFieldAscii(igBlock.getMinedBlockData().getCoinBaseData().getAscciOfField());
    }
}
