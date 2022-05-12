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
import {BlockStatsExElementMobile} from "./BlockStatsExElementMobile";
import Link from "@mui/material/Link";
import {Link as LinkRR} from "react-router-dom";
import {SecondaryTypo, Styled6n1TableRow} from "../../utils/CommonComponents";

export function BlockStatsExMobile(props) {
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
              <TableBody>
                <Styled6n1TableRow>
                  <HeaderTableCell ><SecondaryTypo>Height</SecondaryTypo></HeaderTableCell >
                  <HeaderTableCell ><SecondaryTypo>Miner name</SecondaryTypo></HeaderTableCell >
                </Styled6n1TableRow>
                <TableRow>
                  <TableCell>{igBlockEx.h}</TableCell>
                  <TableCell>{linkTo(igBlockEx.mn)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell ><SecondaryTypo>Lost reward</SecondaryTypo></TableCell >
                  <TableCell ><SecondaryTypo>Lost reward excluding not in mempool txs</SecondaryTypo></TableCell >
                </TableRow>
                <TableRow>
                  <TableCell>{format(",")(igBlockEx.lr)}</TableCell>
                  <TableCell>{format(",")(igBlockEx.lreNIM)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan="2" ><SecondaryTypo>Block date:</SecondaryTypo> </TableCell >
                </TableRow>
                <TableRow>
                  <TableCell colSpan="2">{new Date(igBlockEx.t).toISOString()}</TableCell>
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
                  <HeaderTableCell colSpan={3} align="center" >Transactions when mined block arrived</HeaderTableCell >
                </TableRow>
                <TableRow>
                  <HeaderTableCell colSpan={3} align="center">
                    <IconButton onClick={onAllShow}>
                      {viewAll === true && <KeyboardArrowUpIcon />}
                      {viewAll === false && <KeyboardArrowDownIcon />}
                    </IconButton >
                  </HeaderTableCell >
                </TableRow>
              </TableHead>
              <TableBody>

                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.minedBlock, "imb")}
                  inMempool="-"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="In mined block"
                  numTxs={igBlockEx.minedBlock.num}
                  weight={igBlockEx.minedBlock.weight}
                  fees={igBlockEx.minedBlock.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.candidateBlock, "icb")}
                  inMempool="-"
                  inMinedBlock="-"
                  inCandidateBlock="Yes"
                  meaning="In our candidate block"
                  numTxs={igBlockEx.candidateBlock.num}
                  weight={igBlockEx.candidateBlock.weight}
                  fees={igBlockEx.candidateBlock.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.inCommon, "ic")}
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="Yes"
                  meaning="In common"
                  numTxs={igBlockEx.inCommon.num}
                  weight={igBlockEx.inCommon.weight}
                  fees={igBlockEx.inCommon.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.ignoredONRByMiner, "ibm")}
                  inMempool="Yes"
                  inMinedBlock="No"
                  inCandidateBlock="Yes"
                  meaning="Ignored by miner"
                  numTxs={igBlockEx.ignoredONRByMiner.num}
                  weight={igBlockEx.ignoredONRByMiner.weight}
                  fees={igBlockEx.ignoredONRByMiner.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.ignoredByUs, "ibu")}
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="No"
                  meaning="Ignored by us"
                  numTxs={igBlockEx.ignoredByUs.num}
                  weight={igBlockEx.ignoredByUs.weight}
                  fees={igBlockEx.ignoredByUs.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.relayedToUs, "rtu")}
                  inMempool="Yes"
                  inMinedBlock="Yes"
                  inCandidateBlock="-"
                  meaning="Relayed to us"
                  numTxs={igBlockEx.relayedToUs.num}
                  weight={igBlockEx.relayedToUs.weight}
                  fees={igBlockEx.relayedToUs.fees}
                />
                <BlockStatsExElementMobile
                  expanded={viewAll}
                  key={keyFor(igBlockEx.notRelayedToUs, "nrtu")}
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
