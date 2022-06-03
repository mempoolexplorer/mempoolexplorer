package com.mempoolexplorer.backend.controllers;

import com.mempoolexplorer.backend.components.containers.price.BitcoinPriceContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/price")
public class PriceController {

	@Autowired
	private BitcoinPriceContainer priceContainer;

	@GetMapping("/BTC")
	public Double getPrice() {
		return priceContainer.getUSDPrice();
	}
}
