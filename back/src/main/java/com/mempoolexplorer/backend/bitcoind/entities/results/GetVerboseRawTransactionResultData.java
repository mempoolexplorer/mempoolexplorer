package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.List;

public class GetVerboseRawTransactionResultData {

	private String hex;// The serialized, hex-encoded data for 'txid'
	private String txid;// The transaction id (same as provided)
	private String hash;// The transaction hash (differs from txid for witness transactions)
	private Integer size;// The serialized transaction size
	private Integer vsize;// The virtual transaction size (differs from size for witness transactions)
	private Integer weight;// The transaction's weight (between vsize*4-3 and vsize*4)
	private Integer version;// The version
	private Long locktime;// The lock time
	private List<GetVerboseRawTransactionInput> vin;// Transaction input vector
	private List<GetVerboseRawTransactionOutput> vout;// Transaction output vector
	private String blockhash;// (optional)If the transaction has been included in a block on the local best
	// block chain, this is the hash of that block encoded as hex in RPC byte order
	private Integer confirmations;// If the transaction has been included in a block on the local best block
	// chain, this is how many confirmations it has. Otherwise, this is 0
	private Integer time;// If the transaction has been included in a block on the local best block
	// chain, this is the block header time of that block (may be in the future)
	private Integer blocktime;// This field is currently identical to the time field described above

	public String getHex() {
		return hex;
	}

	public void setHex(String hex) {
		this.hex = hex;
	}

	public String getTxid() {
		return txid;
	}

	public void setTxid(String txid) {
		this.txid = txid;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public Integer getSize() {
		return size;
	}

	public void setSize(Integer size) {
		this.size = size;
	}

	public Integer getVsize() {
		return vsize;
	}

	public void setVsize(Integer vsize) {
		this.vsize = vsize;
	}

	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public Long getLocktime() {
		return locktime;
	}

	public void setLocktime(Long locktime) {
		this.locktime = locktime;
	}

	public List<GetVerboseRawTransactionInput> getVin() {
		return vin;
	}

	public void setVin(List<GetVerboseRawTransactionInput> vin) {
		this.vin = vin;
	}

	public List<GetVerboseRawTransactionOutput> getVout() {
		return vout;
	}

	public void setVout(List<GetVerboseRawTransactionOutput> vout) {
		this.vout = vout;
	}

	public String getBlockhash() {
		return blockhash;
	}

	public void setBlockhash(String blockhash) {
		this.blockhash = blockhash;
	}

	public Integer getConfirmations() {
		return confirmations;
	}

	public void setConfirmations(Integer confirmations) {
		this.confirmations = confirmations;
	}

	public Integer getTime() {
		return time;
	}

	public void setTime(Integer time) {
		this.time = time;
	}

	public Integer getBlocktime() {
		return blocktime;
	}

	public void setBlocktime(Integer blocktime) {
		this.blocktime = blocktime;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("GetVerboseRawTransactionResultData [hex=");
		builder.append(hex);
		builder.append(", txid=");
		builder.append(txid);
		builder.append(", hash=");
		builder.append(hash);
		builder.append(", size=");
		builder.append(size);
		builder.append(", vsize=");
		builder.append(vsize);
		builder.append(", version=");
		builder.append(version);
		builder.append(", locktime=");
		builder.append(locktime);
		builder.append(", vin=");
		builder.append(vin);
		builder.append(", vout=");
		builder.append(vout);
		builder.append(", blockhash=");
		builder.append(blockhash);
		builder.append(", confirmations=");
		builder.append(confirmations);
		builder.append(", time=");
		builder.append(time);
		builder.append(", blocktime=");
		builder.append(blocktime);
		builder.append("]");
		return builder.toString();
	}

}
