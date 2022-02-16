package com.mempoolexplorer.backend.entities.transaction;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TxAncestry {
	private int descendantCount;// The number of in-mempool descendant transactions (including this one)
	private int descendantSize;// virtual transaction size of in-mempool descendants (including this one)
	private int ancestorCount;// The number of in-mempool ancestor transactions (including this one)
	private int ancestorSize;// virtual transaction size of in-mempool ancestors (including this one)
	private List<String> depends = new ArrayList<>();// unconfirmed transactions used as inputs for this transaction
	// (txIds list)
	private List<String> spentby = new ArrayList<>();// unconfirmed transactions spending outputs from this transaction
	// (txIds list)

	public TxAncestry deepCopy() {
		TxAncestry txa = new TxAncestry();
		txa.setDescendantCount(this.descendantCount);
		txa.setDescendantSize(this.descendantSize);
		txa.setAncestorCount(this.ancestorCount);
		txa.setAncestorSize(this.ancestorSize);

		List<String> newDepends = new ArrayList<>();
		if (this.depends != null) {
			newDepends.addAll(this.depends);
		}

		List<String> newSpentBy = new ArrayList<>();
		if (this.spentby != null) {
			newSpentBy.addAll(this.spentby);
		}
		txa.setDepends(newDepends);
		txa.setSpentby(newSpentBy);

		return txa;
	}
}
