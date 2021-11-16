import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { petitionTo } from "../../utils/utils";
import { intervalToDuration, formatDuration } from "date-fns";
import "./IgTransactionList.css";

export function IgTransactionList(props) {
  const [igTxList, setIgTxList] = useState([]);

  useEffect(() => {
    petitionTo("/ignoredTxAPI/ignoredTxs", setIgTxList);
  }, []);

  function duration(seconds) {
    return formatDuration(
      intervalToDuration({
        start: new Date(0, 0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, 0, seconds),
      })
    );
  }
  return (
    <div>
      <h2>{igTxList.length} ignored transactions in mempool</h2>
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
