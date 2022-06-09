import React, {useEffect, useState} from "react";
import {AccordionBlockStats} from "../Common/AccordionBlockStats";
import Box from '@mui/material/Box'
import {TabPanel} from "../../utils/CommonComponents";
import {txMempoolPetitionTo} from "../../utils/utils";
import {useParams} from "react-router-dom";
import {AlgoTabs} from "../Common/AlgoTabs";
import {BlockStatsList} from "./BlockStatsList";
import {getAlgoName, getAlgoNumber} from "../Common/AlgoTabs";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {BlockStatsListMobile} from "./BlockStatsListMobile";

export function BlocksStats(props) {
  const {setTitle} = props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("1300"));
  const {algop} = useParams();
  const [data, setData] = useState([]);
  const [unit, setUnit] = useState("SAT");
  const [pageState, setPageState] = useState({page: 0, size: 10});
  const [algo, setAlgo] = useState(getAlgoNumber(algop));

  useEffect(() => {
    setTitle("Blocks Reward");
    txMempoolPetitionTo(
      "/ignoringBlocksAPI/ignoringBlocks/" +
      pageState.page +
      "/" +
      pageState.size +
      "/" +
      getAlgoName(algo),
      setData
    );
  }, [pageState, algo]);

  function onNextPage() {
    if (data.ignoringBlockStatsList.length === pageState.size) {
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
        {
          data.ignoringBlockStatsList !== undefined && data.ignoringBlockStatsList !== null &&
          <>
            {!mobile && <BlockStatsList
              igBlockList={data.ignoringBlockStatsList}
              btcusd={data.btcPrice}
              unit={unit}
              setUnit={setUnit}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
              algo={getAlgoName(algo)}
            />
            }
            {
              mobile && <BlockStatsListMobile
                igBlockList={data.ignoringBlockStatsList}
                btcusd={data.btcPrice}
                unit={unit}
                setUnit={setUnit}
                onNextPage={onNextPage}
                onPrevPage={onPrevPage}
                algo={getAlgoName(algo)}
              />
            }
          </>
        }
      </>
    );
  }

  return (
    <Box>
      <AccordionBlockStats>
        <span>Block reward lost because of ignored transactions</span>
      </AccordionBlockStats>
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
