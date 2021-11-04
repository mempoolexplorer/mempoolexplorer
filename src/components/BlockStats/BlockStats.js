import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { petitionTo } from "../../utils/utils";
import "./BlockStats.css";
import { BlockStatsEx } from "./BlockStatsEx";
import { BlockStatsList } from "./BlockStatsList";

export function BlockStats(props) {
  const { id } = useParams();

  const [igBlockList, setIgBlockList] = useState([]);
  const [igBlockEx, setIgBlockEx] = useState();

  const [pageState, setPageState] = useState({ page: 0, size: 40});

  useEffect(() => {
    if (id === undefined) {
      petitionTo(
        "/ignoringBlocksAPI/ignoringBlocks/" +
          pageState.page +
          "/" +
          pageState.size,
        setIgBlockList
      );
    } else {
      petitionTo("/ignoringBlocksAPI/ignoringBlock/" + id, setIgBlockEx);
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
    return (
      <BlockStatsList
        igBlockList={igBlockList}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    );
  } else if (igBlockEx !== undefined) {
    return <BlockStatsEx igBlockEx={igBlockEx} />;
  } else return null;
}
