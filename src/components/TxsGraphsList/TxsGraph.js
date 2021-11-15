import React, { useState } from "react";
import { Link } from "react-router-dom";
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
          <td>Graph #: {i}</td>
          <td>
            #Txs:{" "}
            <span className="clickable" onClick={onShow}>
              {txG.txSet.length}
            </span>
          </td>
          <td>Linear: {!txG.nonLinear ? "true" : "false"}</td>
        </tr>
      </thead>
      <tbody>
        {visible === true &&
          txG.txSet.map((txId, j) => (
            <tr key={i + j}>
              <td colSpan="3">
                <Link to={"/mempool/" + txId}>{txId}</Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
