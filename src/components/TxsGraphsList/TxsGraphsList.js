import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { TxsGraph } from "./TxsGraph";
import "./TxsGraphsList.css";

export function TxsGraphsList() {
  const [txsGraphs, setTxsGraphs] = useState([]);

  useEffect(() => {
    petitionTo("/miningQueueAPI/txGraphList", setTxsGraphs);
  }, []);

  return (
    <div className="divGraphList">
      {txsGraphs.length !== 0 && (
        <div className="divExplanation">
          <h2>List of transaction dependency graphs currently in mempool:</h2>
          <table className="tableExplanation ">
            <tbody>
              <tr>
                <td>
                  Linear: No tx within graph has more than one ascendant nor
                  more than one descendant.
                </td>
              </tr>
              <tr>
                <td>
                  Non linear: A tx within graph has more than one ascendant or
                  more than one descendant.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {txsGraphs.length === 0 && (
        <div className="divMaxTxs">
          <span>
            No graphs has been calculated since there are too many transactions
            in mempool
          </span>
        </div>
      )}
      {txsGraphs.map((txG, i) => (
        <TxsGraph key={i} txG={txG} i={i} />
      ))}
    </div>
    // return <div>{JSON.stringify(txGL, null, 2)}</div>;
  );
}
