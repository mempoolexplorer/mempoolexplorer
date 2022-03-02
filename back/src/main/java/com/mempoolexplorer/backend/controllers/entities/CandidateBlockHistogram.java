package com.mempoolexplorer.backend.controllers.entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateBlockHistogram {

	// Map SatVByte->TxHistogram
	Map<Integer, SatVByteHistogramElement> histogramMap = new HashMap<Integer, SatVByteHistogramElement>(100);
	List<SatVByteHistogramElement> histogramList = new ArrayList<>();
}
