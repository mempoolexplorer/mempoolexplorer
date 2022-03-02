package com.mempoolexplorer.backend.entities.transaction;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mempoolexplorer.backend.entities.fees.Feeable;

public class Transaction implements Feeable {

	private String txId;
	private List<TxInput> txInputs = new ArrayList<>();
	private List<TxOutput> txOutputs = new ArrayList<>();
	private int weight;// for SegWit
	// BE CAREFUL: THIS FIELD MUST KEPT UPDATED, COULD CHANGE ONCE RECEIVED!!!!
	private Fees fees;
	private long timeInSecs;// Epoch time in seconds since the transaction entered in mempool (set by
	// bitcoind).
	// BE CAREFUL: THIS FIELD MUST KEPT UPDATED, COULD CHANGE ONCE RECEIVED!!!!
	private TxAncestry txAncestry;
	private boolean bip125Replaceable;
	private String hex;// Raw transaction in hexadecimal
	// RPC

	public Transaction deepCopy() {
		Transaction tx = new Transaction();
		tx.setTxId(this.txId);
		if (this.txInputs != null) {
			tx.setTxInputs(this.txInputs.stream().map(TxInput::deepCopy).collect(Collectors.toList()));
		}
		if (this.txOutputs != null) {
			tx.setTxOutputs(this.txOutputs.stream().map(TxOutput::deepCopy).collect(Collectors.toList()));
		}
		tx.setWeight(weight);
		if (this.fees != null) {
			tx.setFees(this.fees.deepCopy());
		}
		tx.setTimeInSecs(this.timeInSecs);
		if (this.txAncestry != null) {
			tx.setTxAncestry(this.txAncestry.deepCopy());
		}
		tx.setBip125Replaceable(this.bip125Replaceable);
		tx.setHex(this.hex);
		return tx;
	}

	public boolean isNonStandard() {
		for (TxOutput txo : txOutputs) {
			if (txo.getAddress() == null) {
				return true;
			}
		}
		return false;
	}

	@Override
	public String getTxId() {
		return txId;
	}

	// Be carefull because tx.getSatvByteIncludingAncestors could not be coherent
	// with tx.getSatvByte since one is calculated using vSize(a rounded up integer)
	// and the other using weight (accurate)
	@Override
	// @JsonIgnore
	public double getSatvByteIncludingAncestors() {
		if (txAncestry.getAncestorSize() == 0)
			return 0;
		// txAncestry.getAncestorSize() return vSize. But it is rounded up as is an
		// integer, not double. :-( .This is not accurate.
		return ((double) fees.getAncestor()) / ((double) txAncestry.getAncestorSize());

	}

	// Be carefull because tx.getSatvByteIncludingAncestors could not be coherent
	// with tx.getSatvByte since one is calculated using vSize(a rounded up integer)
	// and the other using weight (accurate)
	@Override
	// @JsonIgnore
	public double getSatvByte() {
		// We calculate this using weight, not a vSize field . This is accurate.
		if (getvSize() == 0)
			return 0;
		return (double) (fees.getBase()) / getvSize();
	}

	@Override
	@JsonIgnore
	public long getBaseFees() {
		return fees.getBase();
	}

	@Override
	@JsonIgnore
	public long getAncestorFees() {
		return fees.getAncestor();
	}

	@Override
	public int getWeight() {
		return weight;
	}

	@JsonIgnore
	public double getvSize() {
		return weight / 4.0D;
	}

	public void setTxId(String txId) {
		this.txId = txId;
	}

	public List<TxInput> getTxInputs() {
		return txInputs;
	}

	public void setTxInputs(List<TxInput> txInputs) {
		this.txInputs = txInputs;
	}

	public List<TxOutput> getTxOutputs() {
		return txOutputs;
	}

	public void setTxOutputs(List<TxOutput> txOutputs) {
		this.txOutputs = txOutputs;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public Fees getFees() {
		return fees;
	}

	public void setFees(Fees fees) {
		this.fees = fees;
	}

	public long getTimeInSecs() {
		return timeInSecs;
	}

	public void setTimeInSecs(long timeInSecs) {
		this.timeInSecs = timeInSecs;
	}

	public TxAncestry getTxAncestry() {
		return txAncestry;
	}

	public void setTxAncestry(TxAncestry txAncestry) {
		this.txAncestry = txAncestry;
	}

	public boolean getBip125Replaceable() {
		return bip125Replaceable;
	}

	public void setBip125Replaceable(boolean bip125Replaceable) {
		this.bip125Replaceable = bip125Replaceable;
	}

	public String getHex() {
		return hex;
	}

	public void setHex(String hex) {
		this.hex = hex;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Transaction [txId=");
		builder.append(txId);
		builder.append(", txInputs=");
		builder.append(txInputs);
		builder.append(", txOutputs=");
		builder.append(txOutputs);
		builder.append(", weight=");
		builder.append(weight);
		builder.append(", vSize=");
		builder.append(getvSize());
		builder.append(", fees=");
		builder.append(fees);
		builder.append(", timeInSecs=");
		builder.append(timeInSecs);
		builder.append(", txAncestry=");
		builder.append(txAncestry);
		builder.append(", bip125Replaceable=");
		builder.append(bip125Replaceable);
		builder.append(", hex=");
		builder.append(hex);
		builder.append("]");
		return builder.toString();
	}

	@Override
	public int hashCode() {
		return txId.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Transaction other = (Transaction) obj;
		if (txId == null) {
			if (other.txId != null)
				return false;
		} else if (!txId.equals(other.txId))
			return false;
		return true;
	}

}
