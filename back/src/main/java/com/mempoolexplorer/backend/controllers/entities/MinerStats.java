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
    @JsonProperty("tlrGBT")
    private Long totalLostRewardGBT;
    @JsonProperty("tlrOBA")
    private Long totalLostRewardOBA;
    @JsonProperty("alrGBT")
    private Long avgLostRewardGBT;
    @JsonProperty("alrOBA")
    private Long avgLostRewardOBA;
    // Next pairs are the same except for our fake miner.
    @JsonProperty("tfGBT")
    private Long totalFeesGBT;
    @JsonProperty("tfOBA")
    private Long totalFeesOBA;
    @JsonProperty("afGBT")
    private Long avgFeesGBT;
    @JsonProperty("afOBA")
    private Long avgFeesOBA;// Should be called avgFeesExcBlockRewardPerBlock

    public MinerStats(MinerStatistics ms) {
        minerName = ms.getMinerName();
        numBlocksMined = ms.getNumBlocksMined();
        totalLostRewardGBT = ms.getTotalLostRewardGBT();
        totalLostRewardOBA = ms.getTotalLostRewardOBA();
        avgLostRewardGBT = ms.getAvgLostRewardGBT();
        avgLostRewardOBA = ms.getAvgLostRewardOBA();
        totalFeesGBT = ms.getTotalFeesGBT();
        totalFeesOBA = ms.getTotalFeesOBA();
        avgFeesGBT = ms.getAvgFeesGBT();
        avgFeesOBA = ms.getAvgFeesOBA();
    }
}
