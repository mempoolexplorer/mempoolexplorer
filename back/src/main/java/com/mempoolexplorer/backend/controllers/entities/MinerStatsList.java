package com.mempoolexplorer.backend.controllers.entities;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class MinerStatsList {
	private List<MinerStats> minerStatsList;
	private Double btcPrice;
}
