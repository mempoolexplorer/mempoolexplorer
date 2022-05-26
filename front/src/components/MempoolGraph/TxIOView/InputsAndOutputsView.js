import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React, {useState} from "react";
import {InputsAndOutputsGrid} from './InputsAndOutputsGrid';
import {satsToBTC} from "./amount";
import useTheme from '@mui/material/styles/useTheme';

export function InputsAndOutputsView(props) {
  const {data} = props;
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  function totalOutput() {
    return data.tx.txOutputs.reduce((acc, cur) => acc + cur.amount, 0);
  }

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
            <Typography
              textAlign="right"
              variant="body1"
              fontWeight={theme.typography.fontWeightBold}
              sx={{mr: 3, my: 3}}
            >
              {satsToBTC(totalOutput()) + " BTC"}
            </Typography>
          </AccordionDetails >
        </Accordion>
      }
    </>
  )
}
