import React from "react";
import { satsToBTC } from "./amount";
import "./TxOutput.css";

export function TxOutput(props) {
  const { txOutput, index } = props;

  return (
    <tr>
      <td>#{index}</td>
      {txOutput.address !== null && <td>{txOutput.address} </td>}
      {txOutput.address === null && <td>Non Standard Output (no address)</td>}
      <td>
        <div>{satsToBTC(txOutput.amount)}</div> <div>BTC</div>
      </td>
    </tr>
  );
}
