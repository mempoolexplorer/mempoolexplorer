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
    // Next pairs are the same except for our fake miner.
    @JsonProperty("tfGBT")
    private Long totalFeesGBT;
    @JsonProperty("tfOBA")
    private Long totalFeesOBA;
    @JsonProperty("nebm")
    private int numEmptyBlocksMined;
    @JsonProperty("tflbebGBT")
    private Long totalFeesLostByEmptyBlocksGBT;
    @JsonProperty("tflbebOBA")
    private Long totalFeesLostByEmptyBlocksOBA;
    @JsonProperty("tfnrtu")
    private Long totalFeesNotRelayedToUs;

    public MinerStats(MinerStatistics ms) {
        minerName = ms.getMinerName();
        numBlocksMined = ms.getNumBlocksMined();
        totalLostRewardGBT = ms.getTotalLostRewardGBT();
        totalLostRewardOBA = ms.getTotalLostRewardOBA();
        totalFeesGBT = ms.getTotalFeesGBT();
        totalFeesOBA = ms.getTotalFeesOBA();
        numEmptyBlocksMined = ms.getNumEmptyBlocksMined();
        totalFeesLostByEmptyBlocksGBT = ms.getTotalFeesLostByEmptyBlocksGBT();
        totalFeesLostByEmptyBlocksOBA = ms.getTotalFeesLostByEmptyBlocksOBA();
        totalFeesNotRelayedToUs = ms.getTotalFeesNotRelayedToUs();
    }
}
