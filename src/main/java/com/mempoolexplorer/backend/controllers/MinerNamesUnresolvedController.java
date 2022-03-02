package com.mempoolexplorer.backend.controllers;

import java.util.List;

import com.mempoolexplorer.backend.components.containers.minernames.MinerNamesUnresolvedContainer;
import com.mempoolexplorer.backend.entities.MinerNameUnresolved;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/minerNames")
public class MinerNamesUnresolvedController {

	@Autowired
	private MinerNamesUnresolvedContainer mnuContainer;

	@GetMapping("/unresolved")
	public List<MinerNameUnresolved> getSize() {
		return mnuContainer.getMinerNamesUnresolvedList();
	}

}
