import React, {useState} from "react";
import {format} from "d3-format";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {HeaderTableCell} from "../../utils/CommonComponents";
import {BlockStatsExElement} from "./BlockStatsExElement";
import Link from "@mui/material/Link";
import {Link as LinkRR} from "react-router-dom";

export function BlockStatsEx(props) {
  const {igBlockEx} = props;

  const [viewAll, setViewAll] = useState(false);

  function onAllShow() {
    setViewAll(!viewAll);
  }

  function keyFor(panel, meaning) {
    return viewAll + meaning + panel.num + panel.weight + panel.fees;
  }

  function linkTo(minerName) {
    return <Link component={LinkRR} to={"/miner/" + minerName}>{minerName}</Link>;
  }

  return (
    <Box>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <HeaderTableCell >Height</HeaderTableCell >
                  <HeaderTableCell >Miner name</HeaderTableCell >
                  <HeaderTableCell >Lost reward</HeaderTableCell >
                  <HeaderTableCell >Lost reward excluding not in mempool txs</HeaderTableCell >
                  <HeaderTableCell >Block date:</HeaderTableCell >
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{igBlockEx.h}</TableCell>
                  <TableCell>{linkTo(igBlockEx.mn)}</TableCell>
                  <TableCell>{format(",")(igBlockEx.lr)}</TableCell>
                  <TableCell>{format(",")(igBlockEx.lreNIM)}</TableCell>
                  <TableCell>{new Date(igBlockEx.t).toISOString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" spacing={4} sx={{mt: 2}}>
        <Grid item>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <HeaderTableCell sx={{border: 0, minWidth: 60}}></HeaderTableCell >
                  <HeaderTableCell >In mempool</HeaderTableCell >
                  <HeaderTableCell >In mined block</HeaderTableCell >
                  <HeaderTableCell >
                    <Box>In our candidate</Box> <Box>block</Box>
                  </HeaderTableCell >
                  <HeaderTableCell >Meaning</HeaderTableCell >
                  <HeaderTableCell colSpan="2" sx={{minWidth:250}}>
                    Statistics
                  </HeaderTableCell >
                  <HeaderTableCell >
                    <IconButton onClick={onAllShow}>
                      {viewAll === true && <KeyboardArrowUpIcon />}
                      {viewAll === false && <KeyboardArrowDownIcon />}
                    </IconButton >
                  </HeaderTableCell >
                </TableRow>
              </TableHead>
              <TableBody>

                <BlockStatsExElement
                  first={true}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.mempool, "iom")}
                  lateralMsg="Transactions when mined block arrived"
                  inMempool="Yes"
                  inMinedBlock="-"
                  inCandidateBlock="-"
                  meaning="In our mempool"
                  numTxs={igBlockEx.mempool.num}
                  weight={igBlockEx.mempool.weight}
                  fees={igBlockEx.mempool.fees}
                />

                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.minedBlock, "imb")}
                  lateralMsg=""
                  inMempool="-"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="In mined block"
                  numTxs={igBlockEx.minedBlock.num}
                  weight={igBlockEx.minedBlock.weight}
                  fees={igBlockEx.minedBlock.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.candidateBlock, "icb")}
                  lateralMsg=""
                  inMempool="-"
                  inMinedBlock="-"
                  inCandidateBlock="Yes"
                  meaning="In our candidate block"
                  numTxs={igBlockEx.candidateBlock.num}
                  weight={igBlockEx.candidateBlock.weight}
                  fees={igBlockEx.candidateBlock.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.inCommon, "ic")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="Yes"
                  meaning="In common"
                  numTxs={igBlockEx.inCommon.num}
                  weight={igBlockEx.inCommon.weight}
                  fees={igBlockEx.inCommon.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.ignoredONRByMiner, "ibm")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="No"
                  inCandidateBlock="Yes"
                  meaning="Ignored by miner"
                  numTxs={igBlockEx.ignoredONRByMiner.num}
                  weight={igBlockEx.ignoredONRByMiner.weight}
                  fees={igBlockEx.ignoredONRByMiner.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.ignoredByUs, "ibu")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="No"
                  meaning="Ignored by us"
                  numTxs={igBlockEx.ignoredByUs.num}
                  weight={igBlockEx.ignoredByUs.weight}
                  fees={igBlockEx.ignoredByUs.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.relayedToUs, "rtu")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="Relayed to us"
                  numTxs={igBlockEx.relayedToUs.num}
                  weight={igBlockEx.relayedToUs.weight}
                  fees={igBlockEx.relayedToUs.fees}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={viewAll}
                  key={keyFor(igBlockEx.notRelayedToUs, "nrtu")}
                  lateralMsg=""
                  inMempool="No"
                  inMinedBlock="Yes"
                  inCandidateBlock="No"
                  meaning="Not relayed to us"
                  numTxs={igBlockEx.notRelayedToUs.num}
                  weight={igBlockEx.notRelayedToUs.weight}
                  fees={igBlockEx.notRelayedToUs.fees}
                />
              </TableBody>
            </Table>
          </TableContainer >
        </Grid>
      </Grid>
    </Box >
  );
}
