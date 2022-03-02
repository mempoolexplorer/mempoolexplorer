package com.mempoolexplorer.backend.controllers.entities;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class RecalculateAllStatsResult {

	private List<String> executionInfoList = new ArrayList<>();

}
