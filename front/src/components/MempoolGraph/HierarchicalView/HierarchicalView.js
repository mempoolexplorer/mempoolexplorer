import React, {useState} from "react";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import {MempoolPanel} from "./Panels/MempoolPanel";
import {BlockPanel} from "./Panels/BlockPanel";
import {TxsPanel} from "./Panels/TxsPanel";
import {Explanation} from "./Explanation/Explanation";
import Typography from '@mui/material/Typography';
import {useWindowSize} from "../../../hooks/windowSize";

const ConditionalWrapper = ({condition, wrapperOnTrue, wrapperOnFalse, children}) =>
  condition ? wrapperOnTrue(children) : wrapperOnFalse(children);

export function HierarchicalView(props) {
  const {helpWanted, data, onBlockSelected, onSatVByteSelected, onTxIndexSelected} = props;
  const [expanded, setExpanded] = useState(true);
  const wSize = useWindowSize();

  return (
    <ConditionalWrapper
      condition={data.txIdSelected !== ''}
      wrapperOnTrue={children => {
        return (
          <Accordion expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{mt: 1}}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="HierarchicalView"
              id="HierarchicalView-header"
            >
              <Typography align="center" variant="h5">Hierarchical mempool view</Typography>
            </AccordionSummary>
            <AccordionDetails >
              {children}
            </AccordionDetails>
          </Accordion>
        )
      }}
      wrapperOnFalse={children => {
        return (
          <Box>
            <Divider sx={{my: 3}} />
            {children}
          </Box>
        )
      }}
    >
      <Grid container
        direction={wSize.width < 910 ? "column" : "row"}
        justifyContent="center"
        alignItems="center">

        {helpWanted && <><Explanation />
          <Divider flexItem sx={{my: 2}} /></>}

        <MempoolPanel data={data}
          onBlockSelected={onBlockSelected}
        />

        <BlockPanel data={data}
          onSatVByteSelected={onSatVByteSelected}
        />

        <TxsPanel data={data}
          onTxIndexSelected={onTxIndexSelected}
        />
      </Grid>
    </ConditionalWrapper >
  );
}
