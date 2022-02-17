package com.mempoolexplorer.backend.entities;

import com.mempoolexplorer.backend.entities.fees.FeeableData;
import com.mempoolexplorer.backend.entities.miningqueue.CandidateBlock;

public class CandidateBlockData {
	private int index = 0;// Position of this block in queue
	private int numTxs = 0;
	private int weight = 0;
	private long totalFees = 0;
	private int coinBaseWeight = 0;
	private int precedingTxsCount = 0; // Sum of all txs in preceding blocks

	private FeeableData feeableData = new FeeableData();

	public CandidateBlockData() {

	}

	public CandidateBlockData(CandidateBlock candidateBlock, FeeableData feeableData) {
		this.index = candidateBlock.getIndex();
		this.numTxs = candidateBlock.numTxs();
		this.weight = candidateBlock.getWeight();
		this.totalFees = candidateBlock.getTotalFees();
		this.coinBaseWeight = candidateBlock.getCoinBaseWeight();
		this.precedingTxsCount = candidateBlock.getPrecedingTxsCount();
		this.feeableData = feeableData;
	}

	public int getIndex() {
		return index;
	}

	public int getNumTxs() {
		return numTxs;
	}

	public int getWeight() {
		return weight;
	}

	public long getTotalFees() {
		return totalFees;
	}

	public int getCoinBaseWeight() {
		return coinBaseWeight;
	}

	public int getPrecedingTxsCount() {
		return precedingTxsCount;
	}

	public FeeableData getFeeableData() {
		return feeableData;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	public void setNumTxs(int numTxs) {
		this.numTxs = numTxs;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public void setTotalFees(long totalFees) {
		this.totalFees = totalFees;
	}

	public void setCoinBaseWeight(int coinBaseWeight) {
		this.coinBaseWeight = coinBaseWeight;
	}

	public void setPrecedingTxsCount(int precedingTxsCount) {
		this.precedingTxsCount = precedingTxsCount;
	}

	public void setFeeableData(FeeableData feeableData) {
		this.feeableData = feeableData;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("CandidateBlockData [index=");
		builder.append(index);
		builder.append(", numTxs=");
		builder.append(numTxs);
		builder.append(", weight=");
		builder.append(weight);
		builder.append(", totalFees=");
		builder.append(totalFees);
		builder.append(", coinBaseWeight=");
		builder.append(coinBaseWeight);
		builder.append(", precedingTxsCount=");
		builder.append(precedingTxsCount);
		builder.append(", feeableData=");
		builder.append(feeableData);
		builder.append("]");
		return builder.toString();
	}

}
