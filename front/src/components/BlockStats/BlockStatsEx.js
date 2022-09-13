import React, {useState} from "react";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {HeaderTableCell} from "../../utils/CommonComponents";
import {BlockStatsExElement} from "./BlockStatsExElement";
import Link from "@mui/material/Link";
import {Link as LinkRR} from "react-router-dom";
import {Amount} from "../Common/Amount";

export function BlockStatsEx(props) {
  const {igBlockEx} = props;

  const [viewAll, setViewAll] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expanded4, setExpanded4] = useState(false);
  const [expanded5, setExpanded5] = useState(false);
  const [expanded6, setExpanded6] = useState(false);
  const [expanded7, setExpanded7] = useState(false);
  const [expanded8, setExpanded8] = useState(false);
  const [unit, setUnit] = useState("SAT");

  function onAllShow() {
    setViewAll(!viewAll);
    setExpanded1(!viewAll);
    setExpanded2(!viewAll);
    setExpanded3(!viewAll);
    setExpanded4(!viewAll);
    setExpanded5(!viewAll);
    setExpanded6(!viewAll);
    setExpanded7(!viewAll);
    setExpanded8(!viewAll);
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
                  <HeaderTableCell >Fees</HeaderTableCell >
                  <HeaderTableCell >Lost fees</HeaderTableCell >
                  <HeaderTableCell >
                    <Tooltip title="Lost fees excluding not in mempool txs">
                      <Box>
                        Adjusted lost fees
                      </Box>
                    </Tooltip>
                  </HeaderTableCell >
                  <HeaderTableCell >Block date:</HeaderTableCell >
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{igBlockEx.h}</TableCell>
                  <TableCell>
                    <Tooltip title={"Coinbase: " + igBlockEx.cb} placement="top">
                      {linkTo(igBlockEx.mn)}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Amount sats={igBlockEx.minedBlock.fees === -1 ? 0 : igBlockEx.minedBlock.fees} unit={unit} setUnit={setUnit} btcusd={igBlockEx.btcPrice} />
                  </TableCell>
                  <TableCell>
                    <Amount sats={igBlockEx.lr} unit={unit} setUnit={setUnit} btcusd={igBlockEx.btcPrice} />
                  </TableCell>
                  <TableCell>
                    <Amount sats={igBlockEx.lreNIM} unit={unit} setUnit={setUnit} btcusd={igBlockEx.btcPrice} />
                  </TableCell>
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
                  <HeaderTableCell colSpan="2" sx={{minWidth: 250}}>
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
                  expanded={expanded1}
                  setExpanded={setExpanded1}
                  key={keyFor(igBlockEx.mempool, "iom")}
                  lateralMsg="Transactions when mined block arrived"
                  inMempool="Yes"
                  inMinedBlock="-"
                  inCandidateBlock="-"
                  meaning="In our mempool"
                  numTxs={igBlockEx.mempool.num}
                  weight={igBlockEx.mempool.weight}
                  fees={igBlockEx.mempool.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />

                <BlockStatsExElement
                  first={false}
                  expanded={expanded2}
                  setExpanded={setExpanded2}
                  key={keyFor(igBlockEx.minedBlock, "imb")}
                  lateralMsg=""
                  inMempool="-"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="In mined block"
                  numTxs={igBlockEx.minedBlock.num}
                  weight={igBlockEx.minedBlock.weight}
                  fees={igBlockEx.minedBlock.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded3}
                  setExpanded={setExpanded3}
                  key={keyFor(igBlockEx.candidateBlock, "icb")}
                  lateralMsg=""
                  inMempool="-"
                  inMinedBlock="-"
                  inCandidateBlock="Yes"
                  meaning="In our candidate block"
                  numTxs={igBlockEx.candidateBlock.num}
                  weight={igBlockEx.candidateBlock.weight}
                  fees={igBlockEx.candidateBlock.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded4}
                  setExpanded={setExpanded4}
                  key={keyFor(igBlockEx.inCommon, "ic")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="Yes"
                  meaning="In common"
                  numTxs={igBlockEx.inCommon.num}
                  weight={igBlockEx.inCommon.weight}
                  fees={igBlockEx.inCommon.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded5}
                  setExpanded={setExpanded5}
                  key={keyFor(igBlockEx.ignoredONRByMiner, "ibm")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="No"
                  inCandidateBlock="Yes"
                  meaning="Ignored by miner"
                  numTxs={igBlockEx.ignoredONRByMiner.num}
                  weight={igBlockEx.ignoredONRByMiner.weight}
                  fees={igBlockEx.ignoredONRByMiner.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded6}
                  setExpanded={setExpanded6}
                  key={keyFor(igBlockEx.ignoredByUs, "ibu")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="No"
                  meaning="Ignored by us"
                  numTxs={igBlockEx.ignoredByUs.num}
                  weight={igBlockEx.ignoredByUs.weight}
                  fees={igBlockEx.ignoredByUs.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded7}
                  setExpanded={setExpanded7}
                  key={keyFor(igBlockEx.relayedToUs, "rtu")}
                  lateralMsg=""
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="Relayed to us"
                  numTxs={igBlockEx.relayedToUs.num}
                  weight={igBlockEx.relayedToUs.weight}
                  fees={igBlockEx.relayedToUs.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
                <BlockStatsExElement
                  first={false}
                  expanded={expanded8}
                  setExpanded={setExpanded8}
                  key={keyFor(igBlockEx.notRelayedToUs, "nrtu")}
                  lateralMsg=""
                  inMempool="No"
                  inMinedBlock="Yes"
                  inCandidateBlock="No"
                  meaning="Not relayed to us"
                  numTxs={igBlockEx.notRelayedToUs.num}
                  weight={igBlockEx.notRelayedToUs.weight}
                  fees={igBlockEx.notRelayedToUs.fees}
                  unit={unit}
                  setUnit={setUnit}
                  btcusd={igBlockEx.btcPrice}
                />
              </TableBody>
            </Table>
          </TableContainer >
        </Grid>
      </Grid>
    </Box >
  );
}
