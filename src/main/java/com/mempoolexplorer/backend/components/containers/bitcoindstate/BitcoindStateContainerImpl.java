package com.mempoolexplorer.backend.components.containers.bitcoindstate;

import com.mempoolexplorer.backend.bitcoind.entities.results.GetBlockChainInfoData;
import com.mempoolexplorer.backend.bitcoind.entities.results.GetNetworkInfoData;

import org.springframework.stereotype.Component;

@Component
public class BitcoindStateContainerImpl implements BitcoindStateContainer {

    private GetBlockChainInfoData blockChainInfoData;
    private GetNetworkInfoData networkInfoData;

    @Override
    public void setBlockChainInfoData(GetBlockChainInfoData blockChainInfoData) {
        this.blockChainInfoData = blockChainInfoData;
    }

    @Override
    public GetBlockChainInfoData getBlockChainInfoData() {
        return blockChainInfoData;
    }

    @Override
    public void setNetworkInfoData(GetNetworkInfoData networkInfoData) {
        this.networkInfoData = networkInfoData;
    }

    @Override
    public GetNetworkInfoData getNetworkInfoData() {
        return networkInfoData;
    }

    @Override
    public boolean isPruned() {
        return blockChainInfoData.isPruned();
    }
}
