import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import {intervalToDuration, formatDuration} from "date-fns";
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";

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
                  <HeaderTableCell sx={{minWidth: {md: 120}}}>Biggest Delta</HeaderTableCell>
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
                      <Link component={HashLink}
                        smooth
                        to={"/mempool/" + igTx.i + "#ignoringTxsSection"}
                      >
                        {igTx.i}
                      </Link>
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
