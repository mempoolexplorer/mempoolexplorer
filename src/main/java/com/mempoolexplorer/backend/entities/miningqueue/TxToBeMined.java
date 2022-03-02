package com.mempoolexplorer.backend.entities.miningqueue;

import java.util.List;
import java.util.Optional;

import com.mempoolexplorer.backend.entities.fees.Feeable;
import com.mempoolexplorer.backend.entities.transaction.Transaction;

public class TxToBeMined implements Feeable {
	private Transaction tx;
	private CandidateBlock containingBlock;
	private int positionInBlock;
	private Optional<Transaction> payingChildTx;// Child paying for this tx in case of CPFP
	private Optional<List<Transaction>> parentsAlreadyInBlock;// parents Already in block who modifies satVByte
	private double modifiedSatVByte;

	public TxToBeMined(Transaction tx, Optional<Transaction> payingChildTx,
			Optional<List<Transaction>> parentsAlreadyInBlock, CandidateBlock containedBlock, int positionInBlock,
			double modifiedSatByte) {
		super();
		this.tx = tx;
		this.containingBlock = containedBlock;
		this.positionInBlock = positionInBlock;
		this.payingChildTx = payingChildTx;
		this.parentsAlreadyInBlock = parentsAlreadyInBlock;
		this.modifiedSatVByte = modifiedSatByte;
	}

	public Transaction getTx() {
		return tx;
	}

	public CandidateBlock getContainingBlock() {
		return containingBlock;
	}

	public int getPositionInBlock() {
		return positionInBlock;
	}

	public Optional<Transaction> getPayingChildTx() {
		return payingChildTx;
	}

	public Optional<List<Transaction>> getParentsAlreadyInBlock() {
		return parentsAlreadyInBlock;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((tx == null) ? 0 : tx.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		TxToBeMined other = (TxToBeMined) obj;
		if (tx == null) {
			if (other.tx != null)
				return false;
		} else if (!tx.equals(other.tx))
			return false;
		return true;
	}

	@Override
	public String getTxId() {
		return tx.getTxId();
	}

	@Override
	public double getSatvByte() {
		return tx.getSatvByte();
	}

	@Override
	public double getSatvByteIncludingAncestors() {
		return tx.getSatvByteIncludingAncestors();
	}

	@Override
	public long getBaseFees() {
		return tx.getBaseFees();
	}

	@Override
	public long getAncestorFees() {
		return tx.getAncestorFees();
	}

	@Override
	public int getWeight() {
		return tx.getWeight();
	}

	public double getModifiedSatVByte() {
		return modifiedSatVByte;
	}

}
