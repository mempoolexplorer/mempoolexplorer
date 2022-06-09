import React from "react";
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
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsList(props) {

  const {minersStatsList, btcusd, algo, unit, setUnit} = props;

  const msList = clone(minersStatsList);

  const [selHeader, setSelHeader] = useState('nbm');
  const [asc, setAsc] = useState(true);

  msList.sort(dirSortFun);

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
      {id: 'mn', label: 'Miner Name', minWidth: 180},
      {id: 'nbm', label: '# Mined blocks', minWidth: 0},
      {id: 'tFEBR', label: 'Total fees excluding block reward', minWidth: 180},
      {id: 'tFEBRpb', label: 'Avg. fees excluding block reward per block', minWidth: 150},
      {id: 'tlrBT', label: 'Total lost reward', minWidth: 180},
      {id: 'tlrBTpb', label: 'Avg. lost reward per block', minWidth: 180}
    ] :
    [
      {id: 'mn', label: 'Miner Name', minWidth: 180},
      {id: 'nbm', label: '# Mined blocks', minWidth: 0},
      {id: 'tFEBR', label: 'Total fees excluding block reward', minWidth: 180},
      {id: 'tFEBRpb', label: 'Avg. fees excluding block reward per block', minWidth: 150},
      {id: 'tlrCB', label: 'Total lost reward', minWidth: 180},
      {id: 'tlrCBpb', label: 'Avg. lost reward per block', minWidth: 180},
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
                        <Amount sats={ms.tFEBR} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="right">
                        <Amount sats={ms.tFEBRpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    {algo === "BITCOIND" && <TableCell>
                      <Box textAlign="right">
                        <Amount sats={ms.tlrBT} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    }
                    {algo === "BITCOIND" && <TableCell>
                      <Box textAlign="right">
                        <Amount sats={ms.tlrBTpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    }
                    {algo === "OURS" && <TableCell>
                      <Box textAlign="right">
                        <Amount sats={ms.tlrCB} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    }
                    {algo === "OURS" && <TableCell>
                      <Box textAlign="right">
                        <Amount sats={ms.tlrCBpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </Box>
                    </TableCell>
                    }
                  </StyledTableRow >
                )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

function linkTo(minerName) {
  if (minerName === "global_miner_name") {
    return <Link component={LinkRR} to="/blocks/BITCOIND">global (all miners)</Link>;
  } else {
    return <Link component={LinkRR} to={"/miner/" + minerName}>{minerName}</Link>;
  }
}

