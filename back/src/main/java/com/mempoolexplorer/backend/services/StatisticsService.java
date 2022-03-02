package com.mempoolexplorer.backend.services;

import com.mempoolexplorer.backend.controllers.entities.RecalculateAllStatsResult;
import com.mempoolexplorer.backend.entities.ignored.IgnoringBlock;

public interface StatisticsService {

	RecalculateAllStatsResult recalculateAllStats();

	void saveStatisticsToDB(IgnoringBlock iGBlockBitcoind, IgnoringBlock iGBlockOurs);

}
