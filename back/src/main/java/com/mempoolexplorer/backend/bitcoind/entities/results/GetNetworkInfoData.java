package com.mempoolexplorer.backend.bitcoind.entities.results;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetNetworkInfoData {
	private boolean networkactive;
	private int connections;
	private int connections_in;
	private int connections_out;
}
