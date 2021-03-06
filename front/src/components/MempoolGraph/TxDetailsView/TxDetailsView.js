import {Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React from "react";
import {TxDetailsTable} from "./TxDetailsTable";

export function TxDetailsView(props) {

  const {data, expanded, setExpanded, unit, setUnit} = props;

  return (
    <>
      {data.txIdSelected !== "" &&
        data.tx !== null &&
        data.txDependenciesInfo !== undefined &&
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{mt: 1}}
          id="DetailsTxsSection"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="IgBlocksView"
            id="IgBlocksView-header"
          >
            <Typography align="center" variant="h5">Transaction Details</Typography>
          </AccordionSummary>
          <AccordionDetails >
            <TxDetailsTable unit={unit} setUnit={setUnit} data={data} />
          </AccordionDetails >
        </Accordion>
      }
    </>
  )
}
