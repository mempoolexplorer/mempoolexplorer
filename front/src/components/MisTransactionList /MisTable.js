import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import {HeaderTableCell} from "../../utils/CommonComponents";
import {MisTx} from "./MisTx";
import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function MisTable(props) {
  const [viewAll, setViewAll] = useState(false);
  const {misTxList, algo} = props;
  const theme = useTheme();
  const fitTxId = useMediaQuery(theme.breakpoints.up("480"));

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table sx={{maxWidth: 400}} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow >
                  <HeaderTableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setViewAll(!viewAll)}
                    >
                      {viewAll ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </HeaderTableCell>
                  <HeaderTableCell>#Times Ignored</HeaderTableCell>
                  <HeaderTableCell>State</HeaderTableCell>
                  <HeaderTableCell>
                    {fitTxId && "Transaction Id:"}
                    {!fitTxId && "TxId:"}
                  </HeaderTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {misTxList.map((mTx) => (
                  <MisTx
                    mTx={mTx}
                    algo={algo}
                    key={mTx.txId + viewAll} //Add viewAll as key to force redraw
                    viewAll={viewAll}
                  />))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>

  );
}
