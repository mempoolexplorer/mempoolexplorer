package com.mempoolexplorer.backend.entities.block;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Block {
	public static final boolean CONNECTED_BLOCK = true;
	public static final boolean DISCONNECTED_BLOCK = false;

	private Boolean connected;// connected or disconnected Block (See bitcoind ZMQ interface)
	private Instant changeTime;// This time is set by us
	private String hash;
	private Integer height;
	private Integer weight;// up to 4 millions (sum of vSize*4)
	private Instant minedTime;// This time is set by miners. Can be in the future!
	private Instant medianMinedTime;// This time always increases with respect height

	private CoinBaseTx coinBaseTx;// also in txIds but not in notInMemPoolTransactions

	private Map<String, NotInMemPoolTx> notInMemPoolTransactions = new HashMap<>();

}
