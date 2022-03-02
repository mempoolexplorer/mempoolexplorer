package com.mempoolexplorer.backend.components.clients;

import com.mempoolexplorer.backend.bitcoind.entities.requests.EstimateType;
import com.mempoolexplorer.backend.bitcoind.entities.results.EstimateSmartFeeResult;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfo;
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

public interface BitcoindClient {

	GetRawMemPoolNonVerbose getRawMemPoolNonVerbose();

	GetRawMemPoolVerbose getRawMemPoolVerbose();

	GetMemPoolEntry getMempoolEntry(String txId);

	GetBlockTemplateResult getBlockTemplateResult();

	GetMemPoolInfo getMemPoolInfo();

	GetVerboseRawTransactionResult getVerboseRawTransaction(String txId);

	Integer getBlockCount();

	GetBlockResult getBlock(Integer blockHeight);

	GetBlockResult getBlock(String blockHash);

	EstimateSmartFeeResult estimateSmartFee(EstimateType estimateType, int blocks);

	GetBlockChainInfo getBlockChainInfo();

	GetNetworkInfo getNetworkInfo();

	GetTxOut getTxOut(String txId, int voutIndex);

	GetVerboseRawTransactionResult getVerboseRawTransaction(String txId, String blockHash);

	GetIndexInfo getIndexInfo();
}
