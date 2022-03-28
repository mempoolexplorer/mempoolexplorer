import React, {useEffect, useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {OneTableTabs} from './OneTableTabs';
import {WideTables} from './WideTables';
import {txMempoolPetitionTo} from "../../utils/utils";
import {useTheme} from '@mui/material/styles';
import {Details} from './Details';


export function FeeEstimation(props) {
  const {setTitle} = props;
  const [fees, setFees] = useState({
    csfl: [],
    nsfl: [],
    esfl: [],
  });
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  const fit3Tables = useMediaQuery(theme.breakpoints.up("xl"));
  const wide= useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setTitle("Fee Estimation");
    txMempoolPetitionTo("/smartFeesAPI", setFees);
  }, []);


  return (
    <Box>
      <Accordion expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography align="center" variant="h5">Bitcoind estimated fees</Typography>
        </AccordionSummary>
        <AccordionDetails onClick={() => setExpanded(!expanded)}>
          <Details wide={wide} />
        </AccordionDetails>
      </Accordion>

      {fit3Tables &&
        <WideTables fees={fees} />
      }
      {!fit3Tables &&
        <OneTableTabs fees={fees} />
      }
    </Box >
  );
}
