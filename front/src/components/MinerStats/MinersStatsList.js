
import {useState} from "react";
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

  const headers = algo === "BITCOIND" ?
    [
      {id: 'mn', label: 'Miner Name', minWidth: 240},
      {id: 'nbm', label: '# Mined blocks', minWidth: 0},
      {id: 'tfGBT', label: 'Total fees (excluding block reward)', minWidth: 180},
      {id: 'afGBT', label: 'Avg. fees per block (excluding block reward)', minWidth: 150},
      {id: 'tlrGBT', label: 'Total lost reward', minWidth: 180},
      {id: 'alrGBT', label: 'Avg. lost reward per block', minWidth: 180}
    ] :
    [
      {id: 'mn', label: 'Miner Name', minWidth: 240},
      {id: 'nbm', label: '# Mined blocks', minWidth: 0},
      {id: 'tfOBA', label: 'Total fees (excluding block reward)', minWidth: 180},
      {id: 'afOBA', label: 'Avg. fees per block (excluding block reward)', minWidth: 150},
      {id: 'tlrOBA', label: 'Total lost reward', minWidth: 180},
      {id: 'alrOBA', label: 'Avg. lost reward per block', minWidth: 180},
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
                    <TableCell>{linkTo(ms.mn)}</TableCell>
                    <TableCell>{format(",")(ms.nbm)}</TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={algo === "BITCOIND" ? ms.tfGBT : ms.tfOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={algo === "BITCOIND" ? ms.afGBT : ms.afOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={algo === "BITCOIND" ? ms.tlrGBT : ms.tlrOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={algo === "BITCOIND" ? ms.alrGBT : ms.alrOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
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

