package com.mempoolexplorer.backend.components;

import com.mempoolexplorer.backend.entities.CoinBaseData;

public interface MinerNameResolver {

	CoinBaseData resolveFrom(String coinBaseField);

}
