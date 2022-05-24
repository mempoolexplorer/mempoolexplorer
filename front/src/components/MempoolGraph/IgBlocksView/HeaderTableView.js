import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from '@mui/material/Tooltip';
import {format} from "d3-format";
import React from "react";
import {HeaderTableCell} from "../../../utils/CommonComponents";

export function HeaderTableView(props) {
  const {data, node} = props;
  return (
    <Grid container justifyContent="center" sx={{mt: 2}}>
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Ignored txs HeaderTable">
              <TableHead>
                <TableRow >
                  <HeaderTableCell>#Times Ignored</HeaderTableCell>
                  <HeaderTableCell>Transaction Time</HeaderTableCell>
                  <Tooltip title="Sum of (Tx.satByte-blockMinSatBytes) for each ignoring block">
                    <HeaderTableCell>Total Satoshi/Byte Lost:</HeaderTableCell>
                  </Tooltip>
                  <Tooltip title="TotalSatvBytesLost*tx.vSize">
                    <HeaderTableCell>Total Fees Lost:</HeaderTableCell>
                  </Tooltip>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{format(",")(data.ignoringBlocks.length)}</TableCell>
                  <TableCell>{new Date(node.t).toISOString()}</TableCell>
                  <TableCell>{format(".6f")(data.totalSVByteLost)}</TableCell>
                  <TableCell>{format(",")(data.totalFeesLost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
}
