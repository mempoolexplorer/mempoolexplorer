package com.mempoolexplorer.backend.controllers.entities;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class IgnoringBlockStatsList {
	private List<IgnoringBlockStats> ignoringBlockStatsList;
	private Double btcPrice;
}
