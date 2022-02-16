package com.mempoolexplorer.backend.entities.transaction;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Fees {
	private long base;
	private long modified;
	private long ancestor;
	private long descendant;

	public Fees deepCopy() {
		Fees fees = new Fees();
		fees.setBase(this.base);
		fees.setModified(this.modified);
		fees.setAncestor(this.ancestor);
		fees.setDescendant(this.descendant);
		return fees;
	}
}
