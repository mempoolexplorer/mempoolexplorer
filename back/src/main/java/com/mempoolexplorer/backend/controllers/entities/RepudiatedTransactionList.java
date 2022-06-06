package com.mempoolexplorer.backend.controllers.entities;

import java.util.List;

import com.mempoolexplorer.backend.entities.ignored.RepudiatedTransaction;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RepudiatedTransactionList {

	private List<RepudiatedTransaction> repudiatedTxs;
	private Double btcPrice;
}
