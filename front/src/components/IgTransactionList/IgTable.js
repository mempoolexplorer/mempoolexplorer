import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import {intervalToDuration, formatDuration} from "date-fns";
import {CHashLink} from "../../utils/CommonComponents";
import Tooltip from "@mui/material/Tooltip";

export function IgTable(props) {
  const {igTxList} = props;

  function duration(seconds) {
    const durationStr = formatDuration(
      intervalToDuration({
        start: new Date(0, 0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, 0, seconds),
      })
    );
    if (durationStr === undefined) return "0 seconds";
    return durationStr;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table sx={{maxWidth: 400}} size="small" aria-label="Ignored txs Table">
              <TableHead>
                <TableRow >
                  <HeaderTableCell>#Times Ignored</HeaderTableCell>
                  <HeaderTableCell sx={{minWidth: {md: 120}}}>
                    <Tooltip title="Biggest time difference between tx and blocks arrivals" placement="top" arrow>
                      <Typography>Biggest Delta</Typography>
                    </Tooltip>
                  </HeaderTableCell>
                  <HeaderTableCell>Transaction Id:</HeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {igTxList.map((igTx) => (
                  <StyledTableRow
                    key={igTx.i + igTx.n}
                  >
                    <TableCell>{igTx.n}</TableCell>
                    <TableCell>{duration(igTx.s)}</TableCell>
                    <TableCell>
                      <CHashLink
                        to={"/mempool/" + igTx.i + "#ignoringTxsSection"}
                      >
                        {igTx.i}
                      </CHashLink>
                    </TableCell>
                  </StyledTableRow >
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
}
