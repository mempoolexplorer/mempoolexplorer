import React from "react";
import { satsToBTC } from "./amount";
import "./TxInput.css";

export function TxInput(props) {
  const { txInput, index } = props;

  return (
    <table className="txInputTable">
      <tbody>
        <tr>
          <td>#{index}</td>
          <td className="txIdtd">
            {txInput.txId}:{txInput.voutIndex}
          </td>
          <td>{satsToBTC(txInput.amount)} BTC</td>
        </tr>
      </tbody>
    </table>
  );
}
