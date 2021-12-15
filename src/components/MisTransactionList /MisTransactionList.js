import React, { useEffect, useState } from "react";
import { petitionTo } from "../../utils/utils";
import { HashLink } from "react-router-hash-link";
import { AlgoCombo } from "../Common/AlgoCombo";
import { MisTransaction } from "./MisTransaction";
import "./MisTransactionList.css";

export function MisTransactionList() {
  const [misTxList, setMisTxList] = useState([]);
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
      setMisTxList
    );
  }, [algo, pageState]);

  function onNextPage() {
    if (misTxList.length === pageState.size) {
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
      <h2>Missed transactions are transactions ignored more than 3 times.</h2>
      <div className="misTxCausesDiv">
        Causes of missing transactions are described{" "}
        <HashLink smooth to="/faq#missingTxs">
          here
        </HashLink>
      </div>
      <AlgoCombo onChange={setAlgorithm} />
      <table className="misTxTable">
        <thead>
          <tr>
            <th># Times ignored</th>
            <th>State</th>
            <th>Transaction Id:</th>
            <th className="clickableNoUnderline">
              <button onClick={onAllShow}>
                {viewAll === false && <div>+</div>}
                {viewAll === true && <div>-</div>}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {misTxList.map((mTx) => (
            <MisTransaction
              mTx={mTx}
              algo={algo}
              key={mTx.txId + viewAll} //Add viewAll as key to force redraw
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
