package com.mempoolexplorer.backend.controllers;

import java.util.List;

import com.mempoolexplorer.backend.components.alarms.AlarmLogger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alarms")
public class AlarmsController {

	@Autowired
	private AlarmLogger alarmLogger;

	@GetMapping("/list")
	public List<String> getAlarms() {
		return alarmLogger.getAlarmList();
	}

}
