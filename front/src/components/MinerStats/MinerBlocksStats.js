import React, {useState, useEffect} from "react";
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";
import {BlockStatsList} from "../BlocksStats/BlockStatsList";
import {useParams} from "react-router-dom";
import {BlockStatsListMobile} from "../BlocksStats/BlockStatsListMobile";
import {TabPanel} from "../../utils/CommonComponents";
import {AlgoTabs} from "../Common/AlgoTabs";
import {getAlgoName} from "../Common/AlgoTabs";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {HelpStack} from "../Common/HelpStack";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {txMempoolPetitionTo} from "../../utils/utils";

export function MinerBlocksStats(props) {
  const {setTitle} = props;
  let {id} = useParams();

  const [unit, setUnit] = useState("SAT");
  const [expanded, setExpanded] = useState(true);
  const [igBlockList, setIgBlockList] = useState();
  const [pageState, setPageState] = useState({page: 0, size: 10});
  const [algo, setAlgo] = useState(0);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("1000"));
  const wide = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setTitle("Miners Statistics");
    txMempoolPetitionTo(
      "/minersStatsAPI/ignoringBlocks/" +
      id +
      "/" +
      pageState.page +
      "/" +
      pageState.size +
      "/" +
      getAlgoName(algo),
      setIgBlockList
    );
  }, [id, pageState, algo]);

  function onNextPage() {
    if (igBlockList.ignoringBlockStatsList.length === pageState.size) {
      setPageState({...pageState, page: pageState.page + 1});
    }
  }

  function onPrevPage() {
    setPageState({...pageState, page: Math.max(0, pageState.page - 1)});
  }

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  function BlockStatsCommon() {
    return (
      <>
        {mobile && <BlockStatsListMobile
          igBlockList={igBlockList.ignoringBlockStatsList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={getAlgoName(algo)}
          btcusd={igBlockList.btcPrice}
          unit={unit}
          setUnit={setUnit}
        />}
        {!mobile && <BlockStatsList
          igBlockList={igBlockList.ignoringBlockStatsList}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
          algo={getAlgoName(algo)}
          btcusd={igBlockList.btcPrice}
          unit={unit}
          setUnit={setUnit}
        />}
      </>
    );
  }

  if (igBlockList === undefined || igBlockList === null) return null;
  else return (
    <Box>
      <Accordion expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="MinerStats-content"
          id="MinerStats-header">
          <Typography align="center" variant="h5">Block reward lost because of ignored transactions for {id}</Typography>
        </AccordionSummary>
        <AccordionDetails onClick={() => setExpanded(!expanded)}>
          <HelpStack wide={wide}>
            <span>Reward is compared against our mempool and selected algorithm when a mined block arrives to our node.</span>
            <span><b>Do not</b> interpret this result to compare how good a miningpool is selecting its transactions.</span>
            <span>Negative lost reward means better reward than us.</span>
            <span>Details can be found{" "}
              <Link component={HashLink} smooth to="/faq#miners">
                here
              </Link>{" "}</span>
          </HelpStack>
        </AccordionDetails>
      </Accordion>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        <BlockStatsCommon />
      </TabPanel>
      <TabPanel value={algo} index={1}>
        <BlockStatsCommon />
      </TabPanel>
    </Box >
  );
}
