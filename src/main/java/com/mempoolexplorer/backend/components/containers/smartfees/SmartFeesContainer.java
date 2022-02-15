package com.mempoolexplorer.backend.components.containers.smartfees;

import com.mempoolexplorer.backend.entities.SmartFees;

import org.springframework.stereotype.Component;

@Component
public interface SmartFeesContainer {

    void refresh(SmartFees smartfees);

    SmartFees getCurrentSmartFees();
}
