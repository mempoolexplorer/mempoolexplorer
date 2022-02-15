package com.mempoolexplorer.backend.components.containers.smartfees;

import java.util.concurrent.atomic.AtomicReference;

import com.mempoolexplorer.backend.entities.SmartFees;

import org.springframework.stereotype.Component;

@Component
public class SmartFeesContainerImpl implements SmartFeesContainer {

    private AtomicReference<SmartFees> smartfees = new AtomicReference<>();

    @Override
    public void refresh(SmartFees smartfees) {
        this.smartfees.set(smartfees);
    }

    @Override
    public SmartFees getCurrentSmartFees() {
        return smartfees.get();
    }

}
