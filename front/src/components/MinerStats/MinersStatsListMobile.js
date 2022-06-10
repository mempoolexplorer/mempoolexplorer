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
import {SecondaryTypo, HeaderTableCell, Styled6n1TableRow} from "../../utils/CommonComponents";
import Grid from "@mui/material/Grid"
import {Link} from "@mui/material";
import {Link as LinkRR} from "react-router-dom";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsListMobile(props) {

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
      {id: 'mn', label: 'Miner Name'},
      {id: 'nbm', label: '# Mined blocks'},
      {id: 'tFEBR', label: 'Total fees (excluding block reward)'},
      {id: 'tFEBRpb', label: 'Avg. fees per block (excluding block reward)'},
      {id: 'tlrBT', label: 'Total lost reward'},
      {id: 'tlrBTpb', label: 'Avg. lost reward per block'},
    ] :
    [
      {id: 'mn', label: 'Miner Name'},
      {id: 'nbm', label: '# Mined blocks'},
      {id: 'tFEBR', label: 'Total fees (excluding block reward)'},
      {id: 'tFEBRpb', label: 'Avg. fees per block (excluding block reward)'},
      {id: 'tlrCB', label: 'Total lost reward'},
      {id: 'tlrCBpb', label: 'Avg. lost reward per block'},
    ];

  function Header(i) {
    return (
      <HeaderTableCell>
        <TableSortLabel
          active={headers[i].id === selHeader}
          direction={getDir()}
          onClick={handleClick(headers[i])}>
          {headers[i].label}
        </TableSortLabel>
      </HeaderTableCell>
    );
  }
  function HeaderRow(i) {
    return (
      <TableRow>{Header(i)}{Header(i + 1)}</TableRow>
    )
  }

  return (
    <Box >
      <Grid container justifyContent="center" sx={{marginTop: 2}} >
        <Grid item>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="BlockStatsListMobile table">
              <TableHead>
                {HeaderRow(0)}
                {HeaderRow(2)}
                {HeaderRow(4)}
              </TableHead>
              <TableBody>
                {msList.map((ms) => (
                  <React.Fragment key={ms.mn} >
                    <Styled6n1TableRow>
                      <TableCell><SecondaryTypo >{headers[0].label}</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo >{headers[1].label}</SecondaryTypo></TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>{linkTo(ms.mn)}</TableCell>
                      <TableCell>{format(",")(ms.nbm)}</TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell><SecondaryTypo variant="body2">{headers[2].label}</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo variant="body2">{headers[3].label}</SecondaryTypo></TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>
                        <Amount sats={ms.tFEBR} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                      <TableCell>
                        <Amount sats={ms.tFEBRpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell><SecondaryTypo variant="body2">{headers[4].label}</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo variant="body2">{headers[5].label}</SecondaryTypo></TableCell>
                    </Styled6n1TableRow>
                    {algo === "BITCOIND" &&
                      <Styled6n1TableRow>
                        <TableCell>
                          <Amount sats={ms.tlrBT} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                        </TableCell>
                        <TableCell>
                          <Amount sats={ms.tlrBTpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                        </TableCell>
                      </Styled6n1TableRow>
                    }{algo === "OURS" &&
                      <Styled6n1TableRow>
                        <TableCell>
                          <Amount sats={ms.tlrCB} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                        </TableCell>
                        <TableCell>
                          <Amount sats={ms.tlrCBpb} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                        </TableCell>
                      </Styled6n1TableRow>
                    }
                  </React.Fragment>
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

