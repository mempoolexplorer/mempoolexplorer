package com.mempoolexplorer.backend.threads;

public enum MempoolEventEnum {
    TXADD("Transaction added"), TXDEL("Transaction removed"), BLOCKCON("Block connected"),
    BLOCKDIS("Block disconnected");

    private String msg;

    MempoolEventEnum(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
