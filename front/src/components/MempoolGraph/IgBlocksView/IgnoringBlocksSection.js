import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useTheme from '@mui/material/styles/useTheme';
import Typography from "@mui/material/Typography";
import useMediaQuery from '@mui/material/useMediaQuery';
import React from "react";
import {HeaderTableView} from "./HeaderTableView";
import {HeaderTableViewMobile} from "./HeaderTableViewMobile";
import {TableView} from "./TableView";

export function IgnoringBlocksSection(props) {
  const {unit, setUnit} = props;
  const igData = props.igData;
  const btcusd = props.btcusd;
  const node = props.nodeData;
  const algo = props.algo;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (igData === undefined || igData === null) return null;
  if (igData.ignoringBlocks === undefined || igData.ignoringBlocks === null)
    return null;

  return (
    <Box>
      {igData.ignoringBlocks.length === 0 && (
        <Grid container sx={{mt: 4}} justifyContent="center">
          <Grid item>
            <Typography variant="h6" sx={{my: 10, maxWidth: 400}} textAlign="center">
              Transaction has not been ignored by miners comparing against{" "}{getAlgoStr(algo)} algorithm.
            </Typography>
          </Grid>
        </Grid>
      )}
      {igData.ignoringBlocks.length !== 0 && (
        <Box>
          {!isMobile && <HeaderTableView data={igData} node={node} unit={unit} setUnit={setUnit} btcusd={btcusd} />}
          {isMobile && <HeaderTableViewMobile data={igData} node={node} unit={unit} setUnit={setUnit} btcusd={btcusd} />}
          <TableView
            data={igData} node={node} algo={algo} rowsPerPage={isMobile ? 1 : 3} />
        </Box>
      )}
    </Box>
  );
}

function getAlgoStr(algo) {
  if (algo === "OURS") {
    return "onBlockArrival";
  } else return "getBlockTemplate";
}
