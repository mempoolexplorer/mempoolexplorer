import React, {useEffect, useState} from "react";
import {AccordionBlockStats} from "../Common/AccordionBlockStats";
import Box from '@mui/material/Box'
import {TabPanel} from "../../utils/CommonComponents";
import {txMempoolPetitionTo} from "../../utils/utils";
import {useParams} from "react-router-dom";
import {AlgoTabs} from "../Common/AlgoTabs";
import {BlockStatsList} from "./BlockStatsList";
import {getAlgoName, getAlgoNumber} from "../Common/AlgoTabs";

export function BlocksStats(props) {
  const {setTitle} = props;
  const {algop} = useParams();
  const [igBlockList, setIgBlockList] = useState([]);

  const [pageState, setPageState] = useState({page: 0, size: 10});
  const [algo, setAlgo] = useState(getAlgoNumber(algop));

  useEffect(() => {
    setTitle("Ignoring Blocks");
    txMempoolPetitionTo(
      "/ignoringBlocksAPI/ignoringBlocks/" +
      pageState.page +
      "/" +
      pageState.size +
      "/" +
      getAlgoName(algo),
      setIgBlockList
    );
  }, [pageState, algo]);

  function onNextPage() {
    if (igBlockList.length === pageState.size) {
      setPageState({...pageState, page: pageState.page + 1});
    }
  }

  function onPrevPage() {
    setPageState({...pageState, page: Math.max(0, pageState.page - 1)});
  }

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  return (
    <Box>
      <AccordionBlockStats>
        <span>Block reward lost because of ignored transactions</span>
      </AccordionBlockStats>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        <BlockStatsList
          igBlockList={igBlockList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={getAlgoName(algo)}
        />
      </TabPanel>
      <TabPanel value={algo} index={1}>
        <BlockStatsList
          igBlockList={igBlockList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={getAlgoName(algo)}
        />
      </TabPanel>
    </Box >
  );
}
