import React from "react";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import {TxInput} from "./TxInput";
import {TxOutput} from "./TxOutput";
import useTheme from '@mui/material/styles/useTheme';
import Typography from "@mui/material/Typography";

export function InputsAndOutputsGrid(props) {
  const {data} = props;
  const tx = data.tx;
  const theme = useTheme();

  return (
    <>
      <Grid container justifyContent="center" >
        <Grid item xs={6}>
          <TableContainer component={Paper}>
            <Table size="small">
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
        <Grid item xs="auto">
          <Typography variant="h4" sx={{m: 2, color: theme.palette.grey[600]}}>></Typography>
        </Grid>
        <Grid item xs={5}>
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
