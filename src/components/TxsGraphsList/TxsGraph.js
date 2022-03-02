import React, { useState } from "react";
import { HashLink } from "react-router-hash-link";
import "./TxsGraph.css";

export function TxsGraph(props) {
  const { txG, i } = props;
  const [visible, setVisible] = useState(false);

  function onShow() {
    setVisible(!visible);
  }

  return (
    <table key={i} className="graphTable">
      <thead>
        <tr>
          <td>Graph {i}</td>
          <td>
            #Txs:{" "}
            <span className="clickable" onClick={onShow}>
              {txG.txSet.length}
            </span>
          </td>
          {/* <td>{!txG.nonLinear ? "Linear" : "Non linear"}</td> */}
        </tr>
      </thead>
      <tbody>
        {visible === true &&
          txG.txSet.map((txId, j) => (
            <tr key={i + j}>
              <td colSpan="3">
                <HashLink
                  smooth
                  to={"/mempool/" + txId + "#txsDependencyGraph"}
                >
                  {txId}
                </HashLink>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
