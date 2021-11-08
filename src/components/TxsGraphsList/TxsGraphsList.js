import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { TxsGraph } from "./TxsGraph";

export function TxsGraphsList(props) {
  const [txsGraphs, setTxsGraphs] = useState([]);

  useEffect(() => {
    petitionTo("/miningQueueAPI/txGraphList", setTxsGraphs);
  }, []);

  return (
    <div>
      {txsGraphs.map((txG, i) => (
        <TxsGraph txG={txG} i={i} />
      ))}
    </div>
    // return <div>{JSON.stringify(txGL, null, 2)}</div>;
  );
}
