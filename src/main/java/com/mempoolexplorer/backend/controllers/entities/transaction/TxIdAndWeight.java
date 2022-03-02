package com.mempoolexplorer.backend.controllers.entities.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TxIdAndWeight {
	private String txId;
	private int weight;
}
