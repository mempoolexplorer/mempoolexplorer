import React, {useState} from "react";
import {format} from "d3-format";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import {HeaderTableCell, StyledTableRow} from "../../utils/CommonComponents";
import Grid from "@mui/material/Grid"
import {Link} from "@mui/material";
import {Link as LinkRR} from "react-router-dom";
import {CHashLink} from "../../utils/CommonComponents";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsList(props) {

  const {minersStatsList, btcusd, algo, unit, setUnit} = props;

  const msList = clone(minersStatsList);
  addAvg(msList);

  const [selHeader, setSelHeader] = useState('nbm');
  const [asc, setAsc] = useState(true);

  msList.sort(dirSortFun);

  function addAvg(msList) {
    msList.forEach((miner) => {
      miner.afGBT = miner.tfGBT / Math.max(miner.nbm, 1);
      miner.afOBA = miner.tfOBA / Math.max(miner.nbm, 1);
      miner.alrGBT = miner.tlrGBT / Math.max(miner.nbm, 1);
      miner.alrOBA = miner.tlrOBA / Math.max(miner.nbm, 1);
    });
  }

  function dirSortFun(a, b) {
    if (asc) return sortFun(a, b);
    return -sortFun(a, b);
  }

  function sortFun(msA, msB) {
    if (msB[selHeader] < msA[selHeader]) return -1;
    if (msB[selHeader] > msA[selHeader]) return 1;
    return 0;
  }

  function getDir() {
    if (asc === true) return 'asc';
    return 'desc';
  }

  const handleClick = (header) => (event) => {
    onHandelClick(event, header);
  }

  function onHandelClick(event, header) {
    if (header.id === selHeader) {
      setAsc(!asc);
      return;
    }
    setSelHeader(header.id);
    setAsc(true);
  }

  function AmountCell(amount) {
    return (
      <TableCell>
        <Box textAlign="right">
          <Amount sats={amount} unit={unit} setUnit={setUnit} btcusd={btcusd} />
        </Box>
      </TableCell>
    );

  }

  const headers = algo === "BITCOIND" ?
    [
      {id: 'mn', fun: (ms) => LinkTo(ms.mn), label: 'Miner Name', minWidth: 240, textAlign: "left"},
      {id: 'nbm', fun: (ms) => NumMinedBlocks(ms.nbm), label: '# Mined blocks', minWidth: 0, textAlign: "left"},
      {id: 'tfGBT', fun: (ms) => AmountCell(ms.tfGBT), label: 'Total fees (excluding block reward)', minWidth: 180, textAlign: "right"},
      {id: 'afGBT', fun: (ms) => AmountCell(ms.afGBT), label: 'Avg. fees per block (excluding block reward)', minWidth: 150, textAlign: "right"},
      {id: 'tlrGBT', fun: (ms) => AmountCell(ms.tlrGBT), label: 'Total lost reward', minWidth: 180, textAlign: "right"},
      {id: 'alrGBT', fun: (ms) => AmountCell(ms.alrGBT), label: 'Avg. lost reward per block', minWidth: 180, textAlign: "right"}
    ] :
    [
      {id: 'mn', fun: (ms) => LinkTo(ms.mn), label: 'Miner Name', minWidth: 240, textAlign: "left"},
      {id: 'nbm', fun: (ms) => NumMinedBlocks(ms.nbm), label: '# Mined blocks', minWidth: 0, textAlign: "left"},
      {id: 'tfOBA', fun: (ms) => AmountCell(ms.tfOBA), label: 'Total fees (excluding block reward)', minWidth: 180, textAlign: "right"},
      {id: 'afOBA', fun: (ms) => AmountCell(ms.afOBA), label: 'Avg. fees per block (excluding block reward)', minWidth: 150, textAlign: "right"},
      {id: 'tlrOBA', fun: (ms) => AmountCell(ms.tlrOBA), label: 'Total lost reward', minWidth: 180, textAlign: "right"},
      {id: 'alrOBA', fun: (ms) => AmountCell(ms.alrOBA), label: 'Avg. lost reward per block', minWidth: 180, textAlign: "right"},
    ];

  return (
    <Box >
      <Grid container justifyContent="center" sx={{margin: 2}} >
        <Grid item>
          <TableContainer component={Paper}>
            <Table sx={{width: 800}} size="small" aria-label="BlockStatsList table">
              <TableHead>
                <TableRow >
                  {headers.map((header) => (
                    <HeaderTableCell key={header.id} sx={{minWidth: header.minWidth}}>
                      <TableSortLabel
                        active={header.id === selHeader}
                        direction={getDir()}
                        onClick={handleClick(header)}>
                        {header.label}
                      </TableSortLabel>
                    </HeaderTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {msList.map((ms) => (
                  <StyledTableRow
                    key={ms.mn}
                  >
                    {headers.map((header) => (
                      < React.Fragment key={header.id} >
                        {header.fun(ms)}
                      </React.Fragment >
                    ))}
                  </StyledTableRow >
                )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box >
  );
}

function linkTo(minerName) {
  if (minerName === "global_miner_name") {
    return <Link component={LinkRR} to="/blocks/BITCOIND">Global (all miners)</Link>;
  } else if (minerName === "our_miner_name") {
    return (
      <CHashLink to="/faq#miners">Ourselves (when block arrives)</CHashLink>);
  } else {
    return <Link component={LinkRR} to={"/miner/" + minerName} sx={{textTransform: "capitalize"}}>{minerName}</Link>;
  }
}

function LinkTo(minerName) {
  if (minerName === "global_miner_name") {
    return (
      <TableCell><Link component={LinkRR} to="/blocks/BITCOIND">Global (all miners)</Link></TableCell>);
  } else if (minerName === "our_miner_name") {
    return (
      <TableCell>
        <CHashLink to="/faq#miners">Ourselves (when block arrives)</CHashLink>
      </TableCell>);
  } else {
    return (
      <TableCell>
        <Link component={LinkRR} to={"/miner/" + minerName} sx={{textTransform: "capitalize"}}>{minerName}</Link>
      </TableCell>
    );
  }
}
function NumMinedBlocks(nmb) {
  return (<TableCell>{format(",")(nmb)}</TableCell>);
}

