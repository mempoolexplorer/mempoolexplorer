import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import useTheme from '@mui/material/styles/useTheme';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import React from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import {TxInput} from "./TxInput";
import {TxOutput} from "./TxOutput";

export function InputsAndOutputsGrid(props) {
  const {data} = props;
  const tx = data.tx;
  const theme = useTheme();
  const fitTxIO = useMediaQuery(theme.breakpoints.up("1800"));

  return (
    <>
      <Grid container alignItems={fitTxIO ? "flex-start" : "center"} justifyContent="center" direction={fitTxIO ? "row" : "column"}>
        <Grid item>
          <TableContainer component={Paper}>
            <Table size="small" >
              <TableBody>
                {tx.txInputs.map((input, index) => (
                  <TxInput
                    key={input.txId + input.voutIndex}
                    txInput={input}
                    index={index}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item>
          <Typography variant="h4" sx={{m: 2, color: theme.palette.grey[600]}}>{fitTxIO ? ">" : "v"}</Typography>
        </Grid>
        <Grid item>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableBody>
                {tx.txOutputs.map((output, index) => (
                  <TxOutput key={index} txOutput={output} index={index} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  )
}
