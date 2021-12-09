import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { AlgoCombo } from "../Common/AlgoCombo";
import { DisTransaction } from "./DisTransaction";
import "./DisTransactionList.css";

export function DisTransactionList() {
  const [disTxList, setDisTxList] = useState([]);
  const [algo, setAlgo] = useState("BITCOIND");
  const [pageState, setPageState] = useState({ page: 0, size: 10 });
  const [viewAll, setViewAll] = useState(false);

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

  function onAllShow() {
    setViewAll(!viewAll);
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
            <th>Transaction Id:</th>
            <th className="clickableNoUnderline" onClick={onAllShow}>
              {viewAll === false && <div>+</div>}
              {viewAll === true && <div>-</div>}
            </th>
          </tr>
        </thead>
        <tbody>
          {disTxList.map((dTx) => (
            <DisTransaction
              dTx={dTx}
              algo={algo}
              key={dTx.txId + viewAll} //Add viewAll as key to force redraw
              vis={viewAll}
            />
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
