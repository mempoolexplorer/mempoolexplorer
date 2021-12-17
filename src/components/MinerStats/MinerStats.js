import React, { useState, useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";
import "./MinerStats.css";
import { MinersStatsList } from "./MinersStatsList";
import { BlockStatsList } from "../BlockStats/BlockStatsList";
import { AlgoCombo } from "../Common/AlgoCombo";
import { petitionTo } from "../../utils/utils";

export function MinerStats() {
  let { id } = useParams();

  const [minersStatsList, setMinersStatsList] = useState([]);
  const [igBlockList, setIgBlockList] = useState();
  const [pageState, setPageState] = useState({ page: 0, size: 40 });
  const [algo, setAlgo] = useState("BITCOIND");

  useEffect(() => {
    if (id === undefined) {
      petitionTo("/minersStatsAPI/historicStats", setMinersStatsList);
    } else {
      petitionTo(
        "/minersStatsAPI/ignoringBlocks/" +
          id +
          "/" +
          pageState.page +
          "/" +
          pageState.size +
          "/" +
          algo,
        setIgBlockList
      );
    }
  }, [id, pageState, algo]);

  function onNextPage() {
    if (igBlockList.length === pageState.size) {
      setPageState({ ...pageState, page: pageState.page + 1 });
    }
  }

  function onPrevPage() {
    setPageState({ ...pageState, page: Math.max(0, pageState.page - 1) });
  }

  function onChangeAlgorithm(event) {
    setAlgo(event.target.value);
  }

  if (id === undefined) {
    return <MinersStatsList minersStatsList={minersStatsList} />;
  } else if (igBlockList !== undefined) {
    return (
      <div>
        <h2>Block reward lost because of ignored transactions for {id}</h2>
        <table className="divExpAccumRewardLost">
          <tbody>
            <tr>
              <td>Reward is compared against our mempool and algorithms.</td>
            </tr>
            <tr>
              <td>
                <b>Do not</b> interpret this result to compare how good a mining
                pool is selecting its transactions.
              </td>
            </tr>
            <tr>
              <td> Negative lost reward means better reward than us.</td>
            </tr>
            <tr>
              <td> Reward units are satoshis.</td>
            </tr>
            <tr>
              <td>
                Details can be found{" "}
                <HashLink smooth to="/faq#miners">
                  here
                </HashLink>{" "}
              </td>
            </tr>
          </tbody>
        </table>
        <AlgoCombo onChange={onChangeAlgorithm} />
        <BlockStatsList
          igBlockList={igBlockList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={algo}
        />
      </div>
    );
  } else return null;
}
