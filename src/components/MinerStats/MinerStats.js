import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MinerStats.css";
import { MinersStatsList } from "./MinersStatsList";
import { BlockStatsList } from "../BlockStats/BlockStatsList";
import { AlgoCombo } from "../Common/AlgoCombo";
import { petitionTo } from "../../utils/utils";

export function MinerStats(props) {
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
