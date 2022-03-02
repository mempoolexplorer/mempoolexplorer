package com.mempoolexplorer.backend.controllers.api;

import com.mempoolexplorer.backend.components.containers.smartfees.SmartFeesContainer;
import com.mempoolexplorer.backend.entities.fees.SmartFees;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/smartFeesAPI")
public class SmartFeesAPIController {

	@Autowired
	private SmartFeesContainer smartFeesContainer;

	@GetMapping("")
	public SmartFees getSmartFees() {
		return smartFeesContainer.getCurrentSmartFees();
	}
}
