package com.mempoolexplorer.backend.entities.fees;

import java.util.Optional;
import java.util.stream.Stream;

/**
 * Class that keeps track of max and min satVByte and txIds using
 * getSatvByteIncludingAncestors() Also total fees in satoshis
 */
public class FeeableData {

	private double maxSatVByteIncAnc = Double.NEGATIVE_INFINITY;
	private double maxSatVByte = Double.NEGATIVE_INFINITY;
	private double minSatVByteIncAnc = Double.POSITIVE_INFINITY;
	private double minSatVByte = Double.POSITIVE_INFINITY;

	private long totalBaseFee = 0;
	private long totalAncestorsFee = 0;

	private int numTxs = 0;
	private int totalWeight = 0;

	private String maxSatVByteIncAncTxId;
	private String maxSatVByteTxId;
	private String minSatVByteIncAncTxId;
	private String minSatVByteTxId;

	public FeeableData(Stream<? extends Feeable> fStream) {
		super();
		checkFees(fStream);
	}

	public FeeableData() {
		super();
	}

	public boolean isValid() {
		return maxSatVByteIncAnc != Double.NEGATIVE_INFINITY;
	}

	public void checkFeeable(Feeable feeable) {
		totalBaseFee += feeable.getBaseFees();
		totalAncestorsFee += feeable.getAncestorFees();
		totalWeight += feeable.getWeight();
		numTxs++;

		if (feeable.getSatvByteIncludingAncestors() == Double.NEGATIVE_INFINITY)
			return;

		if (feeable.getSatvByteIncludingAncestors() > maxSatVByteIncAnc) {
			maxSatVByteIncAnc = feeable.getSatvByteIncludingAncestors();
			maxSatVByteIncAncTxId = feeable.getTxId();
		}
		if (feeable.getSatvByte() > maxSatVByte) {
			maxSatVByte = feeable.getSatvByte();
			maxSatVByteTxId = feeable.getTxId();
		}
		if (feeable.getSatvByteIncludingAncestors() < minSatVByteIncAnc) {
			minSatVByteIncAnc = feeable.getSatvByteIncludingAncestors();
			minSatVByteIncAncTxId = feeable.getTxId();
		}
		if (feeable.getSatvByte() < minSatVByte) {
			minSatVByte = feeable.getSatvByte();
			minSatVByteTxId = feeable.getTxId();
		}
	}

	public void checkOther(FeeableData other) {
		if (other.maxSatVByteIncAnc == Double.NEGATIVE_INFINITY)
			return;
		checkFees(other.maxSatVByteIncAnc, other.maxSatVByteIncAncTxId, other.maxSatVByte, other.maxSatVByteTxId);
		checkFees(other.minSatVByteIncAnc, other.minSatVByteIncAncTxId, other.minSatVByte, other.minSatVByteTxId);
		totalBaseFee += other.totalBaseFee;
		totalAncestorsFee += other.totalAncestorsFee;
		totalWeight += other.totalWeight;
		numTxs += other.numTxs;
	}

	// fee and txId must be checked correct before calling this method.
	private void checkFees(double feeIncAnc, String txIdIncAnc, double fee, String txId) {

		if (feeIncAnc > maxSatVByteIncAnc) {
			maxSatVByteIncAnc = feeIncAnc;
			maxSatVByteIncAncTxId = txIdIncAnc;
		}
		if (feeIncAnc < minSatVByteIncAnc) {
			minSatVByteIncAnc = feeIncAnc;
			minSatVByteIncAncTxId = txIdIncAnc;
		}

		if (fee > maxSatVByte) {
			maxSatVByte = fee;
			maxSatVByteTxId = txId;
		}
		if (fee < minSatVByte) {
			minSatVByte = fee;
			minSatVByteTxId = txId;
		}
	}

	public void checkFees(Stream<? extends Feeable> fStream) {
		fStream.forEach(f -> checkFeeable(f));
	}

	public Optional<String> getMaxSatVByteIncAncTxId() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(maxSatVByteIncAncTxId);
	}

	public Optional<String> getMinSatVByteIncAncTxId() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(minSatVByteIncAncTxId);
	}

	public Optional<Double> getMaxSatVByteIncAnc() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(maxSatVByteIncAnc);
	}

	public Optional<Double> getMinSatVByteIncAnc() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(minSatVByteIncAnc);
	}

	public Optional<String> getMaxSatVByteTxId() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(maxSatVByteTxId);
	}

	public Optional<String> getMinSatVByteTxId() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(minSatVByteTxId);
	}

	public Optional<Double> getMaxSatVByte() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(maxSatVByte);
	}

	public Optional<Double> getMinSatVByte() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(minSatVByte);
	}

	public Optional<Long> getTotalBaseFee() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(totalBaseFee);
	}

	public Optional<Long> getTotalAncestorsFee() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(totalAncestorsFee);
	}

	public Optional<Integer> getNumTxs() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(numTxs);
	}

	public Optional<Integer> getTotalWeight() {
		if (!isValid()) {
			return Optional.empty();
		}
		return Optional.of(totalWeight);
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("FeeableData [");
		if (isValid()) {
			builder.append("totalBaseFee=");
			builder.append(totalBaseFee);
			builder.append(", totalAncestorsFee=");
			builder.append(totalAncestorsFee);
			builder.append(", numTxs=");
			builder.append(numTxs);
			builder.append(", totalWeight=");
			builder.append(totalWeight);
			builder.append(", maxSatVByte=");
			builder.append(maxSatVByte);
			builder.append(", maxSatVByteIncAnc=");
			builder.append(maxSatVByteIncAnc);
			builder.append(", minSatVByte=");
			builder.append(minSatVByte);
			builder.append(", minSatVByteIncAnc=");
			builder.append(minSatVByteIncAnc);
			builder.append(", maxSatVByteTxId=");
			builder.append(maxSatVByteTxId);
			builder.append(", maxSatVByteIncAncTxId=");
			builder.append(maxSatVByteIncAncTxId);
			builder.append(", minSatVByteTxId=");
			builder.append(minSatVByteTxId);
			builder.append(", minSatVByteIncAncTxId=");
			builder.append(minSatVByteIncAncTxId);
		} else {
			builder.append("Not A Value");
		}
		builder.append("]");
		return builder.toString();
	}

}
