package com.mempoolexplorer.backend.entities.block;

import java.time.Instant;

import com.mempoolexplorer.backend.entities.CoinBaseData;
import com.mempoolexplorer.backend.entities.fees.FeeableData;

public class MinedBlockData {

	private Instant changeTime;// This time is set by us
	private String hash;
	private Integer height;
	private Integer weight;// up to 4 millions (sum of vSize*4)
	private Instant minedTime;// This time is set by miners. Can be in the future!
	private Instant medianMinedTime;// This time always increases with respect height
	private CoinBaseTx coinBaseTx;// also in txIds but not in notInMemPoolTransactions
	private CoinBaseData coinBaseData;

	private FeeableData feeableData = new FeeableData();

	public MinedBlockData() {

	}

	public MinedBlockData(Block block, FeeableData feeableData, CoinBaseData coinBaseData) {
		this.changeTime = block.getChangeTime();
		this.hash = block.getHash();
		this.height = block.getHeight();
		this.weight = block.getWeight();
		this.minedTime = block.getMinedTime();
		this.medianMinedTime = block.getMedianMinedTime();
		this.coinBaseTx = block.getCoinBaseTx();
		this.coinBaseData = coinBaseData;
		this.feeableData = feeableData;
	}

	public Instant getChangeTime() {
		return changeTime;
	}

	public String getHash() {
		return hash;
	}

	public Integer getHeight() {
		return height;
	}

	public Integer getWeight() {
		return weight;
	}

	public Instant getMinedTime() {
		return minedTime;
	}

	public Instant getMedianMinedTime() {
		return medianMinedTime;
	}

	public CoinBaseTx getCoinBaseTx() {
		return coinBaseTx;
	}

	public CoinBaseData getCoinBaseData() {
		return coinBaseData;
	}

	public FeeableData getFeeableData() {
		return feeableData;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("MinedBlockData [changeTime=");
		builder.append(changeTime);
		builder.append(", hash=");
		builder.append(hash);
		builder.append(", height=");
		builder.append(height);
		builder.append(", weight=");
		builder.append(weight);
		builder.append(", minedTime=");
		builder.append(minedTime);
		builder.append(", medianMinedTime=");
		builder.append(medianMinedTime);
		builder.append(", coinBaseTx=");
		builder.append(coinBaseTx);
		builder.append(", coinBaseAsciiField=");
		builder.append(coinBaseData);
		builder.append(", coinBaseData=");
		builder.append(feeableData);
		builder.append("]");
		return builder.toString();
	}

}
