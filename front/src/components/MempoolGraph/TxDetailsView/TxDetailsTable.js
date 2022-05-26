import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Paper from "@mui/material/Paper";
import useTheme from '@mui/material/styles/useTheme';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {format} from "d3-format";
import {formatDuration, intervalToDuration} from "date-fns";
import React, {useEffect, useState} from "react";
import {HeaderTableCell, StyledTableRow} from "../../../utils/CommonComponents";
import {getNumberWithOrdinal, splitStrDate} from "../../../utils/utils";
import {feeAnalysis, feeAnalysisStr} from './FeeAnalysis';
const copy = require('clipboard-copy')

export function TxDetailsTable(props) {
  const {data} = props;
  const nodeTx = data.txDependenciesInfo.nodes[0];
  const fblTxSatVByte = data.fblTxSatVByte;
  const [date, setDate] = useState(new Date());
  const [d1, d2] = splitStrDate(new Date(nodeTx.t).toISOString());
  const theme = useTheme();

  const fa = feeAnalysis(nodeTx.m, fblTxSatVByte);

  useEffect(() => {
    const timerId = setInterval(() => updateDataByTimer(), 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  function updateDataByTimer() {
    setDate(new Date());
  }

  function duration(millis) {
    const txDuration = intervalToDuration({
      start: new Date(millis),
      end: date,
    });
    return formatDuration(txDuration);
  }

  return (
    <Grid container justifyContent="center" >
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Ignored txs Table" sx={{wordWrap: "break-word", wordBreak: "break-word"}} >
              <TableHead>
                <TableRow>
                  <HeaderTableCell colSpan="2">{nodeTx.i}
                    <IconButton onClick={() => {
                      copy(nodeTx.i);
                    }} style={{width: 20, height: 20}}
                      sx={{ml: 1}}><ContentCopyIcon style={{width: 20, height: 20}} sx={{ml: 1}}></ContentCopyIcon ></IconButton>
                  </HeaderTableCell >
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <TableCell>Containing Block</TableCell>
                  <TableCell>{getNumberWithOrdinal(nodeTx.bi + 1)}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Weight:</TableCell>
                  <TableCell>{format(",")(nodeTx.w)}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Base fee (sat):</TableCell>
                  <TableCell>{format(",")(nodeTx.f)}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Fees (Sat/VByte):</TableCell>
                  <TableCell>{format("6f")(nodeTx.f / (nodeTx.w / 4))}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>CPFP Fees (Sat/VByte):</TableCell>
                  <TableCell>{format("6f")(nodeTx.m)}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Fee Analysis:</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{
                      ...(fa > 0 && {color: theme.palette.warning.main}),
                      ...(fa <= 0 && {color: theme.palette.text.primary})
                    }} >
                      Tx is paying {feeAnalysisStr(fa)} than last tx of first block
                    </Typography>
                  </TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Fee of last Tx of first block:</TableCell>
                  <TableCell>
                    <Typography variant="body2">{"(" + fblTxSatVByte + " sat/VByte)"}</Typography>
                  </TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Bip 125 Replaceable:</TableCell>
                  <TableCell>{nodeTx.b === false ? "false" : "true"}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>Fist seen date:</TableCell>
                  <TableCell>{d1 + " " + d2}</TableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <TableCell>First seen since:</TableCell>
                  <TableCell>{duration(nodeTx.t)}</TableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid >
  )
}
