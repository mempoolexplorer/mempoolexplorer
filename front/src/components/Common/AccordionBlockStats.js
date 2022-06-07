import React, {useState} from "react";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import {HelpStack} from "../Common/HelpStack";
import {CHashLink} from "../../utils/CommonComponents";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function AccordionBlockStats(props) {
  const {children} = props;
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Accordion expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="BlockStats-content"
        id="BlockStats-header"
      >
        <Typography align="center" variant="h5">{children}</Typography>
      </AccordionSummary>
      <AccordionDetails onClick={() => setExpanded(!expanded)}>
        <HelpStack wide={wide}>
          <span>Reward is compared against our mempool and selected algorithm when a mined block arrives to our node.</span>
          <span><b>Do not</b> interpret this result to compare how good a mining pool is selecting its transactions.</span>
          <span>Negative lost reward means better reward than us.</span>
          <span>
            Details can be found{" "}
            <CHashLink to="/faq#blocksRewardSection">
              here
            </CHashLink>{" "}
          </span>
        </HelpStack>
      </AccordionDetails>
    </Accordion>
  );
}
