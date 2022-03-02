package com.mempoolexplorer.backend.controllers.entities;

import com.mempoolexplorer.backend.entities.fees.FeeableData;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatsData {
    private int num;
    private int weight;
    private long fees;

    public StatsData(FeeableData feeableData) {
        this.num = feeableData.getNumTxs().orElse(-1);
        this.weight = feeableData.getTotalWeight().orElse(-1);
        this.fees = feeableData.getTotalBaseFee().orElse(-1L);
    }
}
