package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class GetRawMemPoolNonVerboseData {

    @JsonProperty("txids")
    List<String> trxHashList;

    @JsonProperty("mempool_sequence")
    int mempoolSequence;

}
