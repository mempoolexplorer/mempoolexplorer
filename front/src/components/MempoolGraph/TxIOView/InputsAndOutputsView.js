import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Typography} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import React, {useState} from "react";
import {InputsAndOutputsGrid} from './InputsAndOutputsGrid';
import {Amount} from '../../Common/Amount';
import useTheme from '@mui/material/styles/useTheme';

export function InputsAndOutputsView(props) {
  const {data, expanded, setExpanded} = props;
  const theme = useTheme();
  const [unit, setUnit] = useState("BTC");

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
          id="IOSection"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="InputsAndOutputsView"
            id="InputsAndOutputsView-header"
          >
            <Typography align="center" variant="h5">Inputs & Outputs</Typography>
          </AccordionSummary>
          <AccordionDetails >
            <InputsAndOutputsGrid data={data} unit={unit} setUnit={setUnit} />
            <Typography
              textAlign="right"
              variant="body1"
              fontWeight={theme.typography.fontWeightBold}
              sx={{mr: 3, my: 3}}
              component="span"
            >
              <Amount sats={totalOutput()} unit={unit} setUnit={setUnit} btcusd={data.btcPrice} />
            </Typography>
          </AccordionDetails >
        </Accordion>
      }
    </>
  )
}
