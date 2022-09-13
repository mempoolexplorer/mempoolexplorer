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
import {CHashLink} from "../../utils/CommonComponents";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function MinersStatsListMobile(props) {

  const {minersStatsList, btcusd, algo, unit, setUnit} = props;

  const msList = clone(minersStatsList);
  addAvg(msList);

  const [selHeader, setSelHeader] = useState('nbm');
  const [asc, setAsc] = useState(true);

  msList.sort(dirSortFun);

  function dirSortFun(a, b) {
    if (asc) return sortFun(a, b);
    return -sortFun(a, b);
  }

  function addAvg(list) {
    list.forEach((miner) => {
      miner.afGBT = miner.tfGBT / Math.max(miner.nbm, 1);
      miner.afOBA = miner.tfOBA / Math.max(miner.nbm, 1);
      miner.alrGBT = miner.tlrGBT / Math.max(miner.nbm, 1);
      miner.alrOBA = miner.tlrOBA / Math.max(miner.nbm, 1);
      miner.aebm = miner.nebm / Math.max(miner.nbm, 1);
      miner.afnrtu = miner.tfnrtu / Math.max(miner.nbm, 1);
      miner.aflbebGBT = miner.tflbebGBT / Math.max(miner.nbm, 1);
      miner.aflbebOBA = miner.tflbebOBA / Math.max(miner.nbm, 1);
    });
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
      {id: 'mn', label: 'Mining Pool'},
      {id: 'nbm', label: '# Mined blocks'},
      {id: 'tfGBT', label: 'Total fees'},
      {id: 'afGBT', label: 'Avg. fees per block'},
      {id: 'tlrGBT', label: 'Total fees lost'},
      {id: 'alrGBT', label: 'Avg. fees lost per block'},
    ] :
    [
      {id: 'mn', label: 'Mining Pool'},
      {id: 'nbm', label: '# Mined blocks'},
      {id: 'tfOBA', label: 'Total fees'},
      {id: 'afOBA', label: 'Avg. fees per block'},
      {id: 'tlrOBA', label: 'Total fees lost'},
      {id: 'alrOBA', label: 'Avg. fees lost per block'},
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
                        <Amount sats={algo === "BITCOIND" ? ms.tfGBT : ms.tfOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                      <TableCell>
                        <Amount sats={algo === "BITCOIND" ? ms.afGBT : ms.afOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell><SecondaryTypo variant="body2">{headers[4].label}</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo variant="body2">{headers[5].label}</SecondaryTypo></TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>
                        <Amount sats={algo === "BITCOIND" ? ms.tlrGBT : ms.tlrOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                      <TableCell>
                        <Amount sats={algo === "BITCOIND" ? ms.alrGBT : ms.alrOBA} unit={unit} setUnit={setUnit} btcusd={btcusd} />
                      </TableCell>
                    </Styled6n1TableRow>
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
    return <Link component={LinkRR} to="/blocks/BITCOIND">Global (all miners)</Link>;
  } else if (minerName === "our_miner_name") {
    return (
      <CHashLink to="/faq#miners">Ourselves (when block arrives)</CHashLink>);
  } else {
    return <Link component={LinkRR} to={"/miner/" + minerName} sx={{textTransform: "capitalize"}}>{minerName}</Link>;
  }
}

