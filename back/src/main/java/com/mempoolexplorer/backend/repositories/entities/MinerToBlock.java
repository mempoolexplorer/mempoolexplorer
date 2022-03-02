package com.mempoolexplorer.backend.repositories.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MinerToBlock {
	private String minerName;
	private Integer blockHeight;

}
