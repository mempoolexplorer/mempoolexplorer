import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Link} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {format} from "d3-format";
import React from "react";
import {Link as LinkRR} from "react-router-dom";
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import {splitStrDate} from "../../utils/utils";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function BlockStatsList(props) {
  const {igBlockList, btcusd, unit, setUnit, onNextPage, onPrevPage, algo} = props;

  const igBList = clone(igBlockList);

  igBList.sort((bA, bB) => bB.h - bA.h);

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="BlockStatsList table">
            <TableHead>
              <TableRow >
                <HeaderTableCell>
                  Height
                </HeaderTableCell>
                <HeaderTableCell>Miner name</HeaderTableCell>
                <HeaderTableCell> Lost reward</HeaderTableCell>
                <HeaderTableCell>
                  <Tooltip title="Lost reward excluding not in our mempool transactions">
                    <Box>
                      <Box>Adjusted lost</Box><Box>reward</Box>
                    </Box>
                  </Tooltip>
                </HeaderTableCell>
                <HeaderTableCell>Block date</HeaderTableCell>
                <HeaderTableCell sx={{maxWidth: 100}}>#Txs in mined block</HeaderTableCell>
                <HeaderTableCell sx={{maxWidth: 100}}>#Txs in our candidate block</HeaderTableCell>
                <HeaderTableCell sx={{maxWidth: 100}}>#Txs in mempool when mined</HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {igBList.map((igb) => {
                const [d1, d2] = splitStrDate(new Date(igb.t).toISOString());
                return (
                  <StyledTableRow
                    key={igb.h}
                  >
                    <TableCell>
                      <Link component={LinkRR} to={"/block/" + igb.h + "/" + algo}>{igb.h}</Link>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={"Coinbase: " + igb.cb} placement="top">
                        <Link component={LinkRR} to={"/miner/" + igb.mn}>{igb.mn}</Link>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={igb.lr} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={igb.lreNIM} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{d1}</Typography>
                      <Typography variant="body2">{d2}</Typography>
                    </TableCell>
                    <TableCell>{format(",")(igb.nInMB)}</TableCell>
                    <TableCell>{format(",")(igb.nInCB)}</TableCell>
                    <TableCell>{format(",")(igb.nInMP)}</TableCell>
                  </StyledTableRow >
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent="center">
          <Grid item>
            <IconButton onClick={onPrevPage}>
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={onNextPage}>
              <NavigateNextIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid >
  );
}
