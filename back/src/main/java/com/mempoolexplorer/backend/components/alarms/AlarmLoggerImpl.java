package com.mempoolexplorer.backend.components.alarms;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import com.mempoolexplorer.backend.utils.SysProps;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AlarmLoggerImpl implements AlarmLogger {

	// Concurrent optimized for high number or transversals.
	private List<String> alarmList = new CopyOnWriteArrayList<>();

	@Override
	public List<String> getAlarmList() {
		return alarmList;
	}

	@Override
	public void addAlarm(String alarm) {
		alarmList.add(Instant.now().toString() + " - " + alarm);
	}

	@Override
	public void prettyPrint() {
		if (!alarmList.isEmpty()) {
			StringBuilder sb = new StringBuilder();
			sb.append(SysProps.NL);
			sb.append("--------------------------------------------------------------------------");
			sb.append(SysProps.NL);
			for (String alarmStr : alarmList) {
				sb.append("- ");
				sb.append(alarmStr);
				sb.append(SysProps.NL);
			}
			sb.append("--------------------------------------------------------------------------");
			if (log.isWarnEnabled()) {
				log.warn(sb.toString());
			}
		}
	}

}
