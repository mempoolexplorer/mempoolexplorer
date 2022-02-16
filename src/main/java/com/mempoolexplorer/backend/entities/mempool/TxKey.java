package com.mempoolexplorer.backend.entities.mempool;

public class TxKey implements Comparable<TxKey> {
	private String txId;
	private Double satBytes;// This includes ancestors!!
	private Long firstSeenInSecs;

	public TxKey(String txId, Double satBytes, Long firstSeenInSecs) {
		super();
		this.txId = txId;
		this.satBytes = satBytes;
		this.firstSeenInSecs = firstSeenInSecs;
	}

	public String getTxId() {
		return txId;
	}

	public Double getSatBytes() {
		return satBytes;
	}

	public Long getFirstSeenInSecs() {
		return firstSeenInSecs;
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
		TxKey other = (TxKey) obj;
		if (firstSeenInSecs == null) {
			if (other.firstSeenInSecs != null)
				return false;
		} else if (!firstSeenInSecs.equals(other.firstSeenInSecs))
			return false;
		if (satBytes == null) {
			if (other.satBytes != null)
				return false;
		} else if (!satBytes.equals(other.satBytes))
			return false;
		if (txId == null) {
			if (other.txId != null)
				return false;
		} else if (!txId.equals(other.txId))
			return false;
		return true;
	}

	@Override
	public int compareTo(TxKey o) {
		int satBytesCmp = this.getSatBytes().compareTo(o.getSatBytes());
		if (satBytesCmp != 0)
			return satBytesCmp;
		int firstSeenSecCmp = this.getFirstSeenInSecs().compareTo(o.getFirstSeenInSecs());
		if (firstSeenSecCmp != 0)
			return firstSeenSecCmp;
		return this.getTxId().compareTo(o.getTxId());
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("TxKey [txId=");
		builder.append(txId);
		builder.append(", satBytes=");
		builder.append(satBytes);
		builder.append(", firstSeenInSecs=");
		builder.append(firstSeenInSecs);
		builder.append("]");
		return builder.toString();
	}

}
