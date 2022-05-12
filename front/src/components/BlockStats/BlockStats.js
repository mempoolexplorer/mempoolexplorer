import React, {useEffect, useState} from "react";
import Box from '@mui/material/Box'
import {TabPanel} from "../../utils/CommonComponents";
import {AccordionBlockStats} from "../Common/AccordionBlockStats";
import {txMempoolPetitionTo} from "../../utils/utils";
import {useParams} from "react-router-dom";
import {BlockStatsEx} from "./BlockStatsEx";
import {BlockStatsExMobile} from "./BlockStatsExMobile";
import {AlgoTabs} from "../Common/AlgoTabs";
import {getAlgoName, getAlgoNumber} from "../Common/AlgoTabs";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function BlockStats(props) {
  const {setTitle} = props;
  const {idParam, algop} = useParams();
  const [id, setId] = useState(idParam);
  const [igBlockEx, setIgBlockEx] = useState();
  const [algo, setAlgo] = useState(getAlgoNumber(algop));
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("900"));

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

  function BlockStatsCommon() {
    return (
      <>
        {igBlockEx!==undefined && !mobile && <BlockStatsEx igBlockEx={igBlockEx}/>}
        {igBlockEx!==undefined && mobile && <BlockStatsExMobile igBlockEx={igBlockEx}/>}
      </>
    );
  }

  return (
    <Box>
      <AccordionBlockStats>
        <span>Mined block profit maximization statistics </span>
      </AccordionBlockStats>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        <BlockStatsCommon/>
      </TabPanel>
      <TabPanel value={algo} index={1}>
        <BlockStatsCommon/>
      </TabPanel>
    </Box >
  );
}
