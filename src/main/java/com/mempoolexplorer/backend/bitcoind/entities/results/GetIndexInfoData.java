package com.mempoolexplorer.backend.bitcoind.entities.results;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetIndexInfoData {

	private TxIndex txindex;
}
