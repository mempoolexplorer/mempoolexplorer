import React from "react";
import { satsToBTC } from "./amount";
import "./TxInput.css";

export function TxInput(props) {
  const { txInput, index } = props;

  return (
    <tr>
      <td>#{index}</td>
      <td className="txIdtd">
        {txInput.txId}:{txInput.voutIndex}
      </td>
      <td>
        <div>{satsToBTC(txInput.amount)}</div>
        <div>BTC</div>
      </td>
    </tr>
  );
}
