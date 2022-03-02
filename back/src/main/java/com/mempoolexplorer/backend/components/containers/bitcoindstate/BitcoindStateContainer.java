package com.mempoolexplorer.backend.components.containers.bitcoindstate;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfoData;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfoData;

public interface BitcoindStateContainer {

    void setBlockChainInfoData(GetBlockChainInfoData blockChainInfoData);

    GetBlockChainInfoData getBlockChainInfoData();

    void setNetworkInfoData(GetNetworkInfoData networkInfoData);

    GetNetworkInfoData getNetworkInfoData();

    boolean isPruned();
}
