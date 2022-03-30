import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box'
import {TabPanel} from "../../utils/CommonComponents";
import {AccordionBlockStats} from "../Common/AccordionBlockStats";
import {txMempoolPetitionTo} from "../../utils/utils";
import {useParams} from "react-router-dom";
import {BlockStatsEx} from "./BlockStatsEx";
import {AlgoTabs} from "../Common/AlgoTabs";
import {getAlgoName, getAlgoNumber} from "../Common/AlgoTabs";

export function BlockStats(props) {
  const {setTitle} = props;
  const {idParam, algop} = useParams();
  const [id, setId] = useState(idParam);
  const [igBlockEx, setIgBlockEx] = useState();
  const [algo, setAlgo] = useState(getAlgoNumber(algop));

  useEffect(() => {
    setTitle("Ignoring Blocks");
    if (id === "last") {
      txMempoolPetitionTo(
        "/ignoringBlocksAPI/lastIgnoringBlock/" + getAlgoName(algo),
        setIgBlockEx
      );
    } else {
      txMempoolPetitionTo(
        "/ignoringBlocksAPI/ignoringBlock/" + id + "/" + getAlgoName(algo),
        setIgBlockEx
      );
    }
  }, [id, algo]);

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  return (
    <Box>
      <AccordionBlockStats>
        <span>Mined block profit maximization statistics </span>
      </AccordionBlockStats>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        {igBlockEx !== undefined && <BlockStatsEx igBlockEx={igBlockEx} />}
      </TabPanel>
      <TabPanel value={algo} index={1}>
        {igBlockEx !== undefined && <BlockStatsEx igBlockEx={igBlockEx} />}
      </TabPanel>
    </Box >
  );
}
