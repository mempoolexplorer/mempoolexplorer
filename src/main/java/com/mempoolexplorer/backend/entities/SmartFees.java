package com.mempoolexplorer.backend.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class SmartFees {
	// These lists are filled from waiting to block 1 to 1008 or until returning 1
	// sat/VByte
	@JsonProperty("csfl")
	private List<SmartFee> conservativeSmartFeeList = new ArrayList<>();
	@JsonProperty("nsfl")
	private List<SmartFee> normalSmartFeeList = new ArrayList<>();
	@JsonProperty("esfl")
	private List<SmartFee> economicalSmartFeeList = new ArrayList<>();
}
