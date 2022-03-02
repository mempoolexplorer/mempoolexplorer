package com.mempoolexplorer.backend.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "bitcoindadapter")
@Getter
@Setter
public class BitcoindAdapterProperties {
    private int refreshBTIntervalMilliSec = 5000;
    private int refreshSmartFeesIntervalMilliSec = 60000;
    private int refreshBCIIntervalMilliSec = 60000;
}
