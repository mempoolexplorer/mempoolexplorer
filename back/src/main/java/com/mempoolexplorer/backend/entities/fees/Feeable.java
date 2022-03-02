package com.mempoolexplorer.backend.entities.fees;

/**
 * Any transaction type which has fees and id
 *
 */
public interface Feeable {

	String getTxId();

	double getSatvByte();// This does not include ancestors. Calculated using weight

	double getSatvByteIncludingAncestors();// This includes ancestors if any. Calculated using vSize

	long getBaseFees();// This does not include ancestors.

	long getAncestorFees();// This includes ancestors if any.

	int getWeight();// This does not include ancestors

}
