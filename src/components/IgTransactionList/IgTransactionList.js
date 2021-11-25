import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { petitionTo } from "../../utils/utils";
import { intervalToDuration, formatDuration } from "date-fns";
import { AlgoCombo } from "../Common/AlgoCombo";
import "./IgTransactionList.css";

export function IgTransactionList(props) {
  const [igTxList, setIgTxList] = useState([]);
  const [algo, setAlgo] = useState("BITCOIND");

  useEffect(() => {
    petitionTo("/ignoredTxAPI/ignoredTxs/" + algo, setIgTxList);
  }, [algo]);

  function duration(seconds) {
    const durationStr = formatDuration(
      intervalToDuration({
        start: new Date(0, 0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, 0, seconds),
      })
    );
  if (durationStr === undefined) return "0 seconds";
  return durationStr;
  }
  function setAlgorithm(event) {
    setAlgo(event.target.value);
  }
  return (
    <div>
      <h2>{igTxList.length} ignored transactions in mempool</h2>
      <AlgoCombo onChange={setAlgorithm} />
      <table className="ignoredTxTable">
        <thead>
          <tr>
            <th>
              # <div>Times</div> <div>ignored</div>{" "}
            </th>
            <th>Biggest Delta</th>
            <th>Transaction Id:</th>
          </tr>
        </thead>
        <tbody>
          {igTxList.map((igTx) => (
            <tr key={igTx.i + igTx.n}>
              <td>{igTx.n}</td>
              <td>{duration(igTx.s)}</td>
              <td>
                <Link to={"/mempool/" + igTx.i}>{igTx.i}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/*{JSON.stringify(igTxList, null, 2)}*/
