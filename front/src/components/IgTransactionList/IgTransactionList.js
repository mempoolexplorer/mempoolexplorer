import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { txMempoolPetitionTo } from "../../utils/utils";
import { intervalToDuration, formatDuration } from "date-fns";
import { AlgoCombo } from "../Common/AlgoCombo";
import "./IgTransactionList.css";

export function IgTransactionList(props) {
  const {setTitle}=props;
  const [igTxList, setIgTxList] = useState([]);
  const [algo, setAlgo] = useState("BITCOIND");

  useEffect(() => {
    setTitle("Ignored Transactions");
    txMempoolPetitionTo("/ignoredTxAPI/ignoredTxs/" + algo, setIgTxList);
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
      <div className="infoIgnoredTxDiv">
        A transaction is considered{" "}
        <HashLink smooth to="/faq#ignoredTransactions">
          ignored
        </HashLink>{" "}
        when has been included in our{" "}
        <HashLink smooth to="/faq#blockTemplate">
          block template
        </HashLink>{" "}
        using a{" "}
        <HashLink smooth to="/faq#txSelAlgo">
          transaction selection algorithm
        </HashLink>{" "}
        but not has been mined.
      </div>
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
                <HashLink
                  smooth
                  to={"/mempool/" + igTx.i + "#ignoringTxsSection"}
                >
                  {igTx.i}
                </HashLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/*{JSON.stringify(igTxList, null, 2)}*/
