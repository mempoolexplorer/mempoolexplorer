package com.mempoolexplorer.backend.controllers;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfoData;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfoData;
import com.mempoolexplorer.backend.components.containers.bitcoindstate.BitcoindStateContainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bitcoindInfo")
public class BitcoindInfoController {

	@Autowired
	private BitcoindStateContainer bitcoindStateContainer;

	@GetMapping("/blockChainInfo")
	public GetBlockChainInfoData getBlockChainInfoData() {
		return bitcoindStateContainer.getBlockChainInfoData();
	}

	@GetMapping("/networkInfo")
	public GetNetworkInfoData getNetworkInfoData() {
		return bitcoindStateContainer.getNetworkInfoData();
	}
}
