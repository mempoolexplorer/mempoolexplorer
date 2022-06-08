package com.mempoolexplorer.backend.controllers.devops;

import com.mempoolexplorer.backend.controllers.entities.RecalculateAllStatsResult;
import com.mempoolexplorer.backend.services.StatisticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recalculateStats")
public class RecalculateController {

	@Autowired
	private StatisticsService statisticsService;

	@GetMapping("/miners")
	public RecalculateAllStatsResult recalculateAllStats() {
		return statisticsService.recalculateAllStats();
	}
}
