package com.mempoolexplorer.backend.components;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.mempoolexplorer.backend.entities.CoinBaseData;
import com.mempoolexplorer.backend.utils.AsciiUtils;
import com.mempoolexplorer.backend.utils.SysProps;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MinerNameResolverImpl implements MinerNameResolver {

	private Logger logger = LoggerFactory.getLogger(MinerNameResolverImpl.class);

	private List<String> minerNames = new ArrayList<>();

	public MinerNameResolverImpl() {

		// Order is important (i.e. "E2M & BTC.TOP" vs "BTC.TOP")
		minerNames = List
				.of("AntPool", "BTC.com", "Huobi", "HuoBi", "poolin.com", "Bitfury", "E2M & BTC.TOP", "slush",
						"bytepool.com", "BTC.TOP", "1THash&58COIN", "1THash", "www.okex.com", "NovaBlock", "ViaBTC",
						"Ukrpool.com", "SpiderPool", "TTTTTT3333", "taal.com", "bitcoin.com", "MiningCity", "ckpool",
						"CN/TT", "MrMike", "lubian.com", "Bitdeer", "Binance", "Foundry USA Pool", "SBICrypto.com Pool",
						"www.okex.com", "Powered by Luxor Tech", "ckpool.org", "MARA Pool", "xxxxxx.com", "btcpool", "KuCoinPool",
						"ultimus", "Sigmapool.com", "terrapool.io", "Titan.io", "okkong.com")
				.stream().map(String::toLowerCase).collect(Collectors.toList());
	}

	@Override
	public CoinBaseData resolveFrom(String coinBaseField) {

		String ascciFromHex = AsciiUtils.hexToAscii(coinBaseField);

		return getMinerName(coinBaseField, ascciFromHex).map(mn -> new CoinBaseData(ascciFromHex, mn))
				.orElse(new CoinBaseData(ascciFromHex, SysProps.MINER_NAME_UNKNOWN));
	}

	private Optional<String> getMinerName(String coinBaseField, String ascciFromHex) {
		return getMinerNameFromCoinBaseField(coinBaseField).or(() -> getMinerNameFromAscci(ascciFromHex))
				.map(this::sanetize);
	}

	private String sanetize(String minerName) {
		return minerName.replace("/", "_slash_").replace("&", "_amp_").toLowerCase();
	}

	private Optional<String> getMinerNameFromCoinBaseField(String coinbaseField) {
		// Search for F2pool (discuss fish)
		// Search for "七彩神仙鱼"->"e4b883e5bda9e7a59ee4bb99e9b1bc" or "🐟"->"f09f909f"

		if (coinbaseField.contains("e4b883e5bda9e7a59ee4bb99e9b1bc") || coinbaseField.contains("f09f909f")) {
			return Optional.of("f2pool");
		}
		return Optional.empty();
	}

	private Optional<String> getMinerNameFromAscci(String ascciFromHex) {
		ascciFromHex = ascciFromHex.replaceAll("[^\\x00-\\x7F]", "").toLowerCase();// Delete all non asccii chars
		for (String minerName : minerNames) {
			if (ascciFromHex.contains(minerName)) {
				return Optional.of(minerName);
			}
		}

		try {
			int start = ascciFromHex.indexOf(SysProps.MINED_BY_START);
			if (start < 0) {
				return Optional.empty();
			}
			start += SysProps.MINED_BY_START.length();

			// int end = ascciFromHex.length();
			int end = ascciFromHex.indexOf(0, start);// up to first null character
			if (end < 0) {
				return Optional.empty();
			}

			return Optional.of(ascciFromHex.substring(start, end).trim());
		} catch (Exception e) {
			logger.error("Error searching for Miner Name. ", e);
			return Optional.empty();
		}
	}
}
