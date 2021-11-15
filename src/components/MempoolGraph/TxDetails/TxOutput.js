import React from "react";
import { satsToBTC } from "./amount";
import "./TxOutput.css";

export function TxOutput(props) {
  const { txOutput, index } = props;

  return (
    <tr>
      <td>#{index}</td>
      {txOutput.addressIds !== null &&
        txOutput.addressIds.map((addr, i, a) => (
          <td>{`${addr} ${a.length - 1 === i ? "" : ", "}`}</td>
        ))}
      {txOutput.addressIds === null && (
        <td>Non Standard Output (no address)</td>
      )}
      {txOutput.addressIds !== null && txOutput.addressIds.length === 0 && (
        <td>Non Standard Output (no address)</td>
      )}
      <td>
        <div>{satsToBTC(txOutput.amount)}</div> <div>BTC</div>
      </td>
    </tr>
  );
}

/*
  return (
    <table className="txOutputTable">
      <tbody>
        {txOutput.addressIds.map((addr, i, a) => (
          <tr key={index}>
            <td>#{index}</td>
            <td>{`${addr} ${a.length - 1 === i ? "" : ", "}`}</td>
            <td>{satsToBTC(txOutput.amount)} BTC</td>
          </tr>
        ))}
      </tbody>
    </table>
  );*/
