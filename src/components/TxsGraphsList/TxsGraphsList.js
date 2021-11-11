import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { TxsGraph } from "./TxsGraph";
import "./TxsGraphsList.css";

export function TxsGraphsList(props) {
  const [txsGraphs, setTxsGraphs] = useState([]);

  useEffect(() => {
    petitionTo("/miningQueueAPI/txGraphList", setTxsGraphs);
  }, []);

  return (
    <div>
      {txsGraphs.length === 0 && (
        <div className="divMaxTxs">
          <span>
            No graphs has been calculated since there are too many transactions
            in mempool
          </span>
        </div>
      )}
      {txsGraphs.map((txG, i) => (
        <TxsGraph txG={txG} i={i} />
      ))}
    </div>
    // return <div>{JSON.stringify(txGL, null, 2)}</div>;
  );
}
