package com.mempoolexplorer.backend.entities.blocktemplate;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateTransaction;
import com.mempoolexplorer.backend.entities.fees.Feeable;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BlockTemplateTx implements Feeable {

	private String txId;
	private long fee;
	private int sigops;
	private int weight;
	private int index;// Within block

	public BlockTemplateTx() {
	}

	// Better keep both classes different
	public BlockTemplateTx(GetBlockTemplateTransaction gbtTx, int index) {
		this.txId = gbtTx.getTxid();
		this.fee = gbtTx.getFee();
		this.sigops = gbtTx.getSigops();
		this.weight = gbtTx.getWeight();
		this.index = index;
	}

	@Override
	public String getTxId() {
		return txId;
	}

	@Override
	public double getSatvByteIncludingAncestors() {
		return getSatvByte();// This is not true. Only to implement Feeable
	}

	@Override
	public long getBaseFees() {
		return fee;
	}

	@Override
	public long getAncestorFees() {
		return fee;// This is not true. Only to implement Feeable
	}

	@Override
	public double getSatvByte() {
		if (weight == 0) {
			return 0;
		}
		return (double) (fee) / ((double) weight / 4D);
	}

	@Override
	public int getWeight() {
		return weight;
	}

	public void setTxId(String txId) {
		this.txId = txId;
	}

	public long getFee() {
		return fee;
	}

	public void setFee(long fee) {
		this.fee = fee;
	}

	public int getSigops() {
		return sigops;
	}

	public void setSigops(int sigops) {
		this.sigops = sigops;
	}

	public void setWeight(int weight) {
		this.weight = weight;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}
}
