import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import {MisTxMobile} from "./MisTxMobile";
import React from "react";

export function MisTableMobile(props) {
  const {misTxList, algo} = props;

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table sx={{wordWrap: "break-word", wordBreak: "break-word"}} size="small" aria-label="a dense table">
              <TableBody>
                {misTxList.map((mTx) => (
                  <MisTxMobile
                    mTx={mTx}
                    algo={algo}
                    key={mTx.txId} //Add viewAll as key to force redraw
                  />))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>

  );
}
