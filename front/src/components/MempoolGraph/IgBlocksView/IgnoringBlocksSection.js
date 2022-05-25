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
  const data = props.igData;
  const node = props.nodeData;
  const algo = props.algo;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (data === undefined || data === null) return null;
  if (data.ignoringBlocks === undefined || data.ignoringBlocks === null)
    return null;

  return (
    <Box>
      {data.ignoringBlocks.length === 0 && (
        <Grid container sx={{mt: 4}} justifyContent="center">
          <Grid item>
            <Typography variant="h6" sx={{my: 10, maxWidth: 400}} textAlign="center">
              Transaction has not been ignored by miners comparing against{" "}{getAlgoStr(algo)} algorithm.
            </Typography>
          </Grid>
        </Grid>
      )}
      {data.ignoringBlocks.length !== 0 && (
        <Box>
          {!isMobile && <HeaderTableView data={data} node={node} />}
          {isMobile && <HeaderTableViewMobile data={data} node={node} />}
          <TableView
            data={data} node={node} algo={algo} rowsPerPage={isMobile ? 1 : 3} />
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
