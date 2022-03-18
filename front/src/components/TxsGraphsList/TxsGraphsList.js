import React, { useEffect, useState } from "react";
import { txMempoolPetitionTo } from "../../utils/utils";
import { TxsGraph } from "./TxsGraph";
import "./TxsGraphsList.css";

export function TxsGraphsList(props) {
  const {setTitle}=props;
  const [txsGraphs, setTxsGraphs] = useState([]);

  useEffect(() => {
    setTitle("Transactions Graphs");
    txMempoolPetitionTo("/miningQueueAPI/txGraphList", setTxsGraphs);
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

      {txsGraphs.length !== 0 && (
        <div>
          <table className="tableGraphs">
            <thead>
              <tr>
                <th>Linear</th>
                <th>Non linear</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {txsGraphs
                    .filter((txG) => !txG.nonLinear)
                    .map((txG, i) => (
                      <TxsGraph key={i} txG={txG} i={i} />
                    ))}
                </td>
                <td>
                  {txsGraphs
                    .filter((txG) => txG.nonLinear)
                    .map((txG, i) => (
                      <TxsGraph key={i} txG={txG} i={i} />
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
    // return <div>{JSON.stringify(txGL, null, 2)}</div>;
  );
}
