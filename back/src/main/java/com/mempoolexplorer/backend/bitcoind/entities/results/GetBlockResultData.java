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
public class GetBlockResultData {

	private String hash;
	private Integer height;
	private Integer weight;// up to 4 million (sum of vByte*4)
	private Long time;// Set by miners, can be in the future!
	private Long mediantime;// Always increases with block height
	private List<String> tx;

}
