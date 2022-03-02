package com.mempoolexplorer.backend.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Component
@ConfigurationProperties(prefix = "bitcoind")

@Getter
@Setter
@ToString
@NoArgsConstructor
public class BitcoindProperties {

	private String user;

	private String password;

	private String host;

	private String rpcPort;

	private String zmqPort;
}
