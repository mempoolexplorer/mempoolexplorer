package com.mempoolexplorer.backend.bitcoind.entities.results;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class GetTxOutData {
  private String bestblock;
  private int confirmations;
  private BigDecimal value;// The number of bitcoins paid to this output. May be 0
  private ScriptPubKey scriptPubKey;// the pubkey script
  private boolean coinbase;
}
