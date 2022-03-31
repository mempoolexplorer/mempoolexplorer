import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {splitStrDate} from "../../utils/utils";
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import {format} from "d3-format";
import {Link} from "@mui/material";
import {Link as LinkRR} from "react-router-dom";

const clone = require("rfdc")();

export function BlockStatsList(props) {
  const {igBlockList, onNextPage, onPrevPage, algo} = props;

  const igBList = clone(igBlockList);

  igBList.sort((bA, bB) => bB.h - bA.h);

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <TableContainer component={Paper}>
          <Table sx={{width: 800}} size="small" aria-label="BlockStatsList table">
            <TableHead>
              <TableRow >
                <HeaderTableCell>Height</HeaderTableCell>
                <HeaderTableCell>Miner name</HeaderTableCell>
                <HeaderTableCell>Lost reward</HeaderTableCell>
                <HeaderTableCell sx={{maxWidth: 90}}>
                  <Tooltip title="Lost reward excluding not in our mempool transactions">
                  <span>Adjusted lost reward</span>
                  </Tooltip>
                </HeaderTableCell>
                <HeaderTableCell>Block date</HeaderTableCell>
                <HeaderTableCell>#Txs in mined block</HeaderTableCell>
                <HeaderTableCell>#Txs in our candidate block</HeaderTableCell>
                <HeaderTableCell>#Txs in mempool when mined</HeaderTableCell>
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
                    <TableCell>{format(",")(igb.lr)}</TableCell>
                    <TableCell>{format(",")(igb.lreNIM)}</TableCell>
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
    </Grid>
  );
}
