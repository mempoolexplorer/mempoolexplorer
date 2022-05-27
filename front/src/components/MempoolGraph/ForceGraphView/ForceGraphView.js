import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from "react";
import {useWindowSize} from "../../../hooks/windowSize";
import {
  dataForForceGraph
} from "../dataCreation";
import {ForceGraph} from "./ForceGraph";
import {ForceGraphHeader} from "./ForceGraphHeader";
import {hasGraphInfoFrom} from "../../../utils/utils";

export function ForceGraphView(props) {
  const {data, onTxIdSelected, lockMempool, setLockMempool,
    expanded, setExpanded, interactive, setInteractive,
    fgMax, setFgMax, open, setOpen} = props;
  const hasGraphInfo = hasGraphInfoFrom(data);
  const size = useWindowSize();

  return (
    <>
      {
        data.txIdSelected !== "" && (
          <Accordion
            disabled={!hasGraphInfo}
            expanded={expanded && hasGraphInfo}
            onChange={() => setExpanded(!expanded)}
            sx={{mt: 1}}
            id="txsDependencyGraph"
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
                <Box >
                  <ForceGraphHeader
                    data={data}
                    interactive={interactive}
                    setInteractive={setInteractive}
                    lockMempool={lockMempool}
                    setLockMempool={setLockMempool}
                    fgMax={fgMax}
                    setFgMax={setFgMax}
                    open={open}
                    setOpen={setOpen}
                  />
                  <ForceGraph
                    colorRange={["LightGreen", "red"]}
                    interactive={interactive}
                    data={dataForForceGraph(data, onTxIdSelected)}
                    height={fgMax ? size.height - 100 : 475}
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
