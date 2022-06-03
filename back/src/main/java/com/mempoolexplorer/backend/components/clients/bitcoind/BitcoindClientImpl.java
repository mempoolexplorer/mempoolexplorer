package com.mempoolexplorer.backend.components.clients.bitcoind;

import java.util.ArrayList;
import java.util.List;

import com.mempoolexplorer.backend.bitcoind.entities.requests.BooleanArrayParamRequest;
import com.mempoolexplorer.backend.bitcoind.entities.requests.EstimateType;
import com.mempoolexplorer.backend.bitcoind.entities.requests.GetBlockTemplateRulesParams;
import com.mempoolexplorer.backend.bitcoind.entities.requests.ObjectArrayParamRequest;
import com.mempoolexplorer.backend.bitcoind.entities.requests.StringArrayParamRequest;
import com.mempoolexplorer.backend.bitcoind.entities.results.EstimateSmartFeeResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockCount;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockHashResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockTemplateResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetIndexInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolEntry;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetMemPoolInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfo;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetRawMemPoolNonVerbose;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetRawMemPoolVerbose;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetTxOut;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetVerboseRawTransactionResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class BitcoindClientImpl implements BitcoindClient {

	@Autowired
	private RestTemplate restTemplate;

	@Override
	public GetRawMemPoolNonVerbose getRawMemPoolNonVerbose() {
		BooleanArrayParamRequest boolParams = new BooleanArrayParamRequest();
		boolParams.setId("2");
		boolParams.setMethod("getrawmempool");
		List<Boolean> params = new ArrayList<>();
		params.add(false);
		params.add(true);
		boolParams.setParams(params);

		return restTemplate.postForObject("/", boolParams, GetRawMemPoolNonVerbose.class);
	}

	@Override
	public GetRawMemPoolVerbose getRawMemPoolVerbose() {
		BooleanArrayParamRequest boolParams = new BooleanArrayParamRequest();
		boolParams.setId("3");
		boolParams.setMethod("getrawmempool");
		List<Boolean> params = new ArrayList<>();
		params.add(true);
		boolParams.setParams(params);

		return restTemplate.postForObject("/", boolParams, GetRawMemPoolVerbose.class);
	}

	@Override
	public GetBlockTemplateResult getBlockTemplateResult() {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("4");
		objectParams.setMethod("getblocktemplate");
		objectParams.setParams(new ArrayList<>());
		GetBlockTemplateRulesParams rulesParams = new GetBlockTemplateRulesParams();
		rulesParams.getRules().add("segwit");
		objectParams.getParams().add(rulesParams);

		return restTemplate.postForObject("/", objectParams, GetBlockTemplateResult.class);
	}

	@Override
	public GetMemPoolInfo getMemPoolInfo() {
		StringArrayParamRequest stringParams = new StringArrayParamRequest();

		stringParams.setId("5");
		stringParams.setMethod("getmempoolinfo");
		stringParams.setParams(new ArrayList<>());

		return restTemplate.postForObject("/", stringParams, GetMemPoolInfo.class);
	}

	@Override
	public GetVerboseRawTransactionResult getVerboseRawTransaction(String txId) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("6");
		objectParams.setMethod("getrawtransaction");
		List<Object> params = new ArrayList<>();
		params.add(txId);
		params.add(Boolean.valueOf(true));
		objectParams.setParams(params);

		return restTemplate.postForObject("/", objectParams, GetVerboseRawTransactionResult.class);
	}

	@Override
	public Integer getBlockCount() {
		StringArrayParamRequest stringParams = new StringArrayParamRequest();
		stringParams.setId("7");
		stringParams.setMethod("getblockcount");
		stringParams.setParams(new ArrayList<>());

		return restTemplate.postForObject("/", stringParams, GetBlockCount.class).getBlockNumber();
	}

	@Override
	public GetBlockResult getBlock(Integer blockHeight) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("8");
		objectParams.setMethod("getblockhash");
		List<Object> params = new ArrayList<>();
		params.add(blockHeight);
		objectParams.setParams(params);

		GetBlockHashResult getblockHashResult = restTemplate.postForObject("/", objectParams, GetBlockHashResult.class);

		String blockHash = getblockHashResult.getBlockHash();
		objectParams = new ObjectArrayParamRequest();
		objectParams.setId("9");
		objectParams.setMethod("getblock");
		params = new ArrayList<>();
		params.add(blockHash);
		params.add(1);// Verbosity level
		objectParams.setParams(params);
		return restTemplate.postForObject("/", objectParams, GetBlockResult.class);
	}

	@Override
	public GetBlockResult getBlock(String blockHash) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();
		objectParams.setId("9");
		objectParams.setMethod("getblock");
		List<Object> params = new ArrayList<>();
		params.add(blockHash);
		params.add(1);// Verbosity level
		objectParams.setParams(params);
		return restTemplate.postForObject("/", objectParams, GetBlockResult.class);
	}

	@Override
	public GetMemPoolEntry getMempoolEntry(String txId) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("10");
		objectParams.setMethod("getmempoolentry");
		List<Object> params = new ArrayList<>();
		params.add(txId);
		objectParams.setParams(params);

		return restTemplate.postForObject("/", objectParams, GetMemPoolEntry.class);
	}

	@Override
	public EstimateSmartFeeResult estimateSmartFee(EstimateType estimateType, int blocks) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("11");
		objectParams.setMethod("estimatesmartfee");
		List<Object> params = new ArrayList<>();
		params.add(blocks);
		params.add(estimateType.name());
		objectParams.setParams(params);
		return restTemplate.postForObject("/", objectParams, EstimateSmartFeeResult.class);
	}

	@Override
	public GetBlockChainInfo getBlockChainInfo() {
		StringArrayParamRequest stringParams = new StringArrayParamRequest();

		stringParams.setId("12");
		stringParams.setMethod("getblockchaininfo");
		stringParams.setParams(new ArrayList<>());

		return restTemplate.postForObject("/", stringParams, GetBlockChainInfo.class);
	}

	@Override
	public GetNetworkInfo getNetworkInfo() {
		StringArrayParamRequest stringParams = new StringArrayParamRequest();

		stringParams.setId("13");
		stringParams.setMethod("getnetworkinfo");
		stringParams.setParams(new ArrayList<>());

		return restTemplate.postForObject("/", stringParams, GetNetworkInfo.class);
	}

	@Override
	public GetTxOut getTxOut(String txId, int voutIndex) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("14");
		objectParams.setMethod("gettxout");
		List<Object> params = new ArrayList<>();
		params.add(txId);
		params.add(Integer.valueOf(voutIndex));
		objectParams.setParams(params);

		return restTemplate.postForObject("/", objectParams, GetTxOut.class);
	}

	@Override
	public GetVerboseRawTransactionResult getVerboseRawTransaction(String txId, String blockHash) {
		ObjectArrayParamRequest objectParams = new ObjectArrayParamRequest();

		objectParams.setId("15");
		objectParams.setMethod("getrawtransaction");
		List<Object> params = new ArrayList<>();
		params.add(txId);
		params.add(Boolean.valueOf(true));
		params.add(blockHash);
		objectParams.setParams(params);

		return restTemplate.postForObject("/", objectParams, GetVerboseRawTransactionResult.class);
	}

	@Override
	public GetIndexInfo getIndexInfo() {
		StringArrayParamRequest stringParams = new StringArrayParamRequest();

		stringParams.setId("16");
		stringParams.setMethod("getindexinfo");
		stringParams.setParams(new ArrayList<>());

		return restTemplate.postForObject("/", stringParams, GetIndexInfo.class);
	}
}
