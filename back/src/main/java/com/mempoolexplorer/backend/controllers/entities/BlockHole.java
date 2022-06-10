package com.mempoolexplorer.backend.controllers.entities;

import java.util.OptionalInt;

import lombok.Getter;

@Getter
public class BlockHole {

	private Integer bInterval = Integer.valueOf(0);// Beginnnig of the hole, or single block.
	private OptionalInt eInterval = OptionalInt.empty();// End of the hole

	public BlockHole(int bInterval) {
		this.bInterval = bInterval;
		this.eInterval = OptionalInt.empty();
	}

	public BlockHole(int bInterval, int eInterval) {
		this.bInterval = bInterval;
		this.eInterval = OptionalInt.of(eInterval);
	}

	@Override
	public String toString() {
		if (eInterval.isEmpty())
			return bInterval.toString();
		else
			return "[" + bInterval.toString() + "," + eInterval.toString() + "]";
	}
}
