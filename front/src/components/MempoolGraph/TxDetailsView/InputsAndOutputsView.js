import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React, {useState} from "react";
import {InputsAndOutputsGrid} from './InputsAndOutputsGrid';

export function InputsAndOutputsView(props) {
  const {data} = props;
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      {data.txIdSelected !== "" &&
        data.tx !== null &&
        data.txDependenciesInfo !== undefined &&
        <Accordion
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{mt: 1}}
          id="ignoringTxsSection"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="InputsAndOutputsView"
            id="InputsAndOutputsView-header"
          >
            <Typography align="center" variant="h5">Inputs & Outputs</Typography>
          </AccordionSummary>
          <AccordionDetails >
            <InputsAndOutputsGrid data={data} />
          </AccordionDetails >
        </Accordion>
      }
    </>
  )
}
