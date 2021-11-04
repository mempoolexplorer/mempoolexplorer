import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MinerStats.css";
import { MinersStatsList } from "./MinersStatsList";
import { BlockStatsList } from "../BlockStats/BlockStatsList";
import { petitionTo } from "../../utils/utils";

export function MinerStats(props) {
  let { id } = useParams();

  const [minersStatsList, setMinersStatsList] = useState([]);
  const [igBlockList, setIgBlockList] = useState();
  const [pageState, setPageState] = useState({ page: 0, size: 40 });

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
          pageState.size,
        setIgBlockList
      );
    }
  }, [id, pageState]);

  function onNextPage() {
    if (igBlockList.length === pageState.size) {
      setPageState({ ...pageState, page: pageState.page + 1 });
    }
  }

  function onPrevPage() {
    setPageState({ ...pageState, page: Math.max(0, pageState.page - 1) });
  }

  if (id === undefined) {
    return <MinersStatsList minersStatsList={minersStatsList} />;
  } else if (igBlockList !== undefined) {
    return (
      <BlockStatsList
        igBlockList={igBlockList}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    );
  } else return null;
}
