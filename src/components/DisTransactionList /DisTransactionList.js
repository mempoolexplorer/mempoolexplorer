import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { AlgoCombo } from "../Common/AlgoCombo";
import { DisTransaction } from "./DisTransaction";
import "./DisTransactionList.css";

export function DisTransactionList(props) {
  const [disTxList, setDisTxList] = useState([]);
  const [algo, setAlgo] = useState("BITCOIND");
  const [pageState, setPageState] = useState({ page: 0, size: 10 });

  useEffect(() => {
    petitionTo(
      "/repudiatedTxAPI/repudiatedTxs/" +
        pageState.page +
        "/" +
        pageState.size +
        "/" +
        algo,
      setDisTxList
    );
  }, [algo, pageState]);

  function onNextPage() {
    if (disTxList.length === pageState.size) {
      setPageState({ ...pageState, page: pageState.page + 1 });
    }
  }

  function onPrevPage() {
    setPageState({ ...pageState, page: Math.max(0, pageState.page - 1) });
  }

  function setAlgorithm(event) {
    setAlgo(event.target.value);
  }

  return (
    <div>
      <h2>
        Disregarded transactions are transactions ignored more than 3 times.
      </h2>
      <AlgoCombo onChange={setAlgorithm} />
      <table className="disTxTable">
        <thead>
          <tr>
            <th># Times ignored</th>
            <th>State</th>
            <th colSpan="2">Transaction Id:</th>
          </tr>
        </thead>
        <tbody>
          {disTxList.map((dTx) => (
            <DisTransaction dTx={dTx} algo={algo} key={dTx.txId}/>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={onPrevPage}>Prev</button>
        <button onClick={onNextPage}>Next</button>
      </div>
    </div>
  );
}
