package com.mempoolexplorer.backend;

import java.net.URISyntaxException;
import java.time.Clock;

import com.mempoolexplorer.backend.components.clients.bitcoind.BitcoindClientResponseErrorHandler;
import com.mempoolexplorer.backend.properties.BitcoindProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@EnableScheduling
@SpringBootApplication
public class BackendApp {

	@Autowired
	private BitcoindProperties bitcoindProperties;

	private static ConfigurableApplicationContext springAppContext;

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(BackendApp.class);
		springAppContext = app.run(args);
	}

	public static void exit() {
		log.warn("Exiting MempoolExplorerBackEnd.");
		if (springAppContext != null) {
			SpringApplication.exit(springAppContext, () -> 1);
		}
	}

	@Bean
	public RestTemplate getBitcoindClient(RestTemplateBuilder restTemplateBuilder)
			throws NumberFormatException, URISyntaxException {
		return restTemplateBuilder.basicAuthentication(bitcoindProperties.getUser(), bitcoindProperties.getPassword())
				.additionalMessageConverters(new MappingJackson2HttpMessageConverter())
				.rootUri(UriComponentsBuilder.newInstance().scheme("http").host(bitcoindProperties.getHost())
						.port(Integer.valueOf(bitcoindProperties.getRpcPort())).toUriString())
				.errorHandler(new BitcoindClientResponseErrorHandler()).build();
	}

	@Bean
	public Clock clock() {
		return Clock.systemDefaultZone();
	}
}
