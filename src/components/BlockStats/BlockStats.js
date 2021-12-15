import React, { useEffect, useState } from "react";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";
import { petitionTo } from "../../utils/utils";
import { AlgoCombo } from "../Common/AlgoCombo";
import "./BlockStats.css";
import { BlockStatsEx } from "./BlockStatsEx";
import { BlockStatsList } from "./BlockStatsList";

export function BlockStats() {
  const { id, algop } = useParams();

  const [igBlockList, setIgBlockList] = useState([]);
  const [igBlockEx, setIgBlockEx] = useState();

  const [pageState, setPageState] = useState({ page: 0, size: 40 });
  const [algo, setAlgo] = useState(algop);

  useEffect(() => {
    if (id === undefined) {
      petitionTo(
        "/ignoringBlocksAPI/ignoringBlocks/" +
          pageState.page +
          "/" +
          pageState.size +
          "/" +
          algo,
        setIgBlockList
      );
    } else if (id === "last") {
      petitionTo("/ignoringBlocksAPI/lastIgnoringBlock/" + algo, setIgBlockEx);
    } else {
      petitionTo(
        "/ignoringBlocksAPI/ignoringBlock/" + id + "/" + algo,
        setIgBlockEx
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
    return (
      <div>
        <h2 className="divInfoIgnBlocks">
          Block reward lost because of ignored transactions
        </h2>
        <div className="divExpIgnBlocks">
          Reward is compared against our mempool and selected algorithm.
          <br></br>
          Negative lost reward means better reward than us.
        </div>
        <div className="divExpIgnBlocks">
          Details can be found{" "}
          <HashLink smooth to="/faq#ignoringBlocksSection">
            here
          </HashLink>{" "}
        </div>
        <AlgoCombo onChange={onChangeAlgorithm} algo={algo} />
        <BlockStatsList
          igBlockList={igBlockList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={algo}
        />
      </div>
    );
  } else if (igBlockEx !== undefined) {
    return (
      <div>
        <h2>Mined block profit maximization statistics </h2>
        <div className="divExpIgnBlocks">
          Reward is compared against our mempool and selected algorithm.
          <br></br>
          Negative lost reward means better reward than us.
        </div>
        <AlgoCombo onChange={onChangeAlgorithm} algo={algo} />
        <BlockStatsEx igBlockEx={igBlockEx} />
      </div>
    );
  } else return null;
}
