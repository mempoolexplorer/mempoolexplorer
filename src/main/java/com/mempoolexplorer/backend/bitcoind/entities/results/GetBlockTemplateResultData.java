package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetBlockTemplateResultData {

	private List<GetBlockTemplateTransaction> transactions;
	int height;

}
