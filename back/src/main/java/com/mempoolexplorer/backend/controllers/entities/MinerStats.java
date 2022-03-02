package com.mempoolexplorer.backend.controllers.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mempoolexplorer.backend.repositories.entities.MinerStatistics;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MinerStats {
    @JsonProperty("mn")
    private String minerName;
    @JsonProperty("nbm")
    private Integer numBlocksMined;
    @JsonProperty("tlrBT")
    private Long totalLostRewardBT;
    @JsonProperty("tlrCB")
    private Long totalLostRewardCB;
    @JsonProperty("tlrBTpb")
    private Long totalLostRewardBTPerBlock;
    @JsonProperty("tlrCBpb")
    private Long totalLostRewardCBPerBlock;

    public MinerStats(MinerStatistics ms) {
        minerName = ms.getMinerName();
        numBlocksMined = ms.getNumBlocksMined();
        totalLostRewardBT = ms.getTotalLostRewardBT();
        totalLostRewardCB = ms.getTotalLostRewardCB();
        totalLostRewardBTPerBlock = ms.getTotalLostRewardBTPerBlock();
        totalLostRewardCBPerBlock = ms.getTotalLostRewardCBPerBlock();
    }
}
