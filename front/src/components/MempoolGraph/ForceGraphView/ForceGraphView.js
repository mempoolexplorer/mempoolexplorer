import React, {useState} from "react";
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {ForceGraphHeader} from "./ForceGraphHeader";
import {ForceGraph} from "./ForceGraph";
import {
  dataForForceGraph,
} from "../dataCreation";

export function ForceGraphView(props) {
  const {data, onTxIdSelected, lockMempool, setLockMempool} = props;
  const [interactive, setInteractive] = useState(false);
  const hasGraphInfo =
    (data.txDependenciesInfo !== undefined) &&
    (data.txDependenciesInfo !== null) &&
    (data.txDependenciesInfo.nodes !== null) &&
    (data.txDependenciesInfo.nodes.length !== 1);
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      {
        data.txIdSelected !== "" && (
          <Accordion
            disabled={!hasGraphInfo}
            expanded={expanded && hasGraphInfo}
            onChange={() => setExpanded(!expanded)}
            sx={{mt: 1}}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="GraphDependenciesView"
              id="GraphDependenciesView-header"
            >
              <Typography align="center" variant="h5">Dependency Graph</Typography>
            </AccordionSummary>
            <AccordionDetails >
              {hasGraphInfo && (
                <Box>
                  <ForceGraphHeader
                    data={data}
                    interactive={interactive}
                    setInteractive={setInteractive}
                    lockMempool={lockMempool}
                    setLockMempool={setLockMempool}
                  />
                  <ForceGraph
                    colorRange={["LightGreen", "red"]}
                    interactive={interactive}
                    data={dataForForceGraph(data, onTxIdSelected)}
                  />
                </Box>
              )
              }
            </AccordionDetails>
          </Accordion>
        )
      }
    </>
  );
}
