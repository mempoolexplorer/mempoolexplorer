package com.mempoolexplorer.backend.entities.miningqueue;

import com.mempoolexplorer.backend.entities.transaction.Transaction;

public class ModifiedTx {

	private Transaction tx;
	private long ancestorsFeesSubstracted;
	private int ancestorWeightSubstracted;

	public ModifiedTx(Transaction tx, long feesToSubstract, int weightToSubsbract) {
		super();
		this.tx = tx;
		this.ancestorsFeesSubstracted = feesToSubstract;
		this.ancestorWeightSubstracted = weightToSubsbract;
	}

	public void substract(long feesToSubstract, int weightToSubsbract) {
		this.ancestorsFeesSubstracted += feesToSubstract;
		this.ancestorWeightSubstracted += weightToSubsbract;
	}

	public Transaction getTx() {
		return tx;
	}

	public void setTx(Transaction tx) {
		this.tx = tx;
	}

	public double getRealAncestorSatVByte() {
		return satVByteFrom(tx.getFees().getAncestor() - ancestorsFeesSubstracted,
				(tx.getTxAncestry().getAncestorSize() * 4) - ancestorWeightSubstracted);
	}

	private double satVByteFrom(long fees, int weight) {
		return ((double) fees) / ((double) (weight) / 4.0D);
	}
}
