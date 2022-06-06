import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, {useState} from "react";
import {TabPanel} from "../../../utils/CommonComponents";
import {AlgoTabs} from "../../Common/AlgoTabs";
import {IgnoringBlocksSection} from "./IgnoringBlocksSection";
import {isTxIgnoredFrom} from '../../../utils/utils';

export function IgBlocksView(props) {

  const {data, expanded, setExpanded, unit, setUnit} = props;
  const igDataBT = data.txIgnoredDataBT;
  const igDataOurs = data.txIgnoredDataOurs;
  const [algo, setAlgo] = useState(0);

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  return (
    <>
      {
        data.txIdSelected !== "" &&
        <Accordion
          disabled={!isTxIgnoredFrom(data)}
          expanded={expanded && isTxIgnoredFrom(data)}
          onChange={() => setExpanded(!expanded)}
          sx={{mt: 1}}
          id="ignoringTxsSection"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="IgBlocksView"
            id="IgBlocksView-header"
          >
            <Typography align="center" variant="h5">{isTxIgnoredFrom(data) ? "Ignored Transaction Data" : "Transaction not ignored"}</Typography>
          </AccordionSummary>
          <AccordionDetails >
            <AlgoTabs onChange={setAlgorithm} algo={algo} />
            <TabPanel value={algo} index={0}>
              <IgnoringBlocksSection
                igData={igDataBT}
                nodeData={data.txDependenciesInfo.nodes[0]}
                algo="BITCOIND"
                unit={unit}
                setUnit={setUnit}
                btcusd={data.btcPrice}
              />
            </TabPanel>
            <TabPanel value={algo} index={1}>
              <IgnoringBlocksSection
                igData={igDataOurs}
                nodeData={data.txDependenciesInfo.nodes[0]}
                algo="OURS"
                unit={unit}
                setUnit={setUnit}
                btcusd={data.btcPrice}
              />
            </TabPanel>
          </AccordionDetails >
        </Accordion>
      }
    </>
  );
}
