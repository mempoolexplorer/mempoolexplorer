import React from "react";
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {splitStrDate} from "../../utils/utils";
import {SecondaryTypo, Styled6n1TableRow} from "../../utils/CommonComponents";
import {format} from "d3-format";
import {Link} from "@mui/material";
import {Link as LinkRR} from "react-router-dom";
import {Amount} from "../Common/Amount";

const clone = require("rfdc")();

export function BlockStatsListMobile(props) {
  const {igBlockList, btcusd, unit, setUnit, onNextPage, onPrevPage, algo} = props;
  const igBList = clone(igBlockList);
  igBList.sort((bA, bB) => bB.h - bA.h);

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="BlockStatsList table mobile">
            <TableBody>
              {igBList.map((igb) => {
                const [d1, d2] = splitStrDate(new Date(igb.t).toISOString());
                return (
                  <React.Fragment key={igb.h} >
                    <Styled6n1TableRow>
                      <TableCell><SecondaryTypo >Height:</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo>Miner name</SecondaryTypo></TableCell>
                      <TableCell><SecondaryTypo>Block date</SecondaryTypo></TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell><Link component={LinkRR} to={"/block/" + igb.h + "/" + algo}>{igb.h}</Link></TableCell>
                      <TableCell>
                        <Tooltip title={"Coinbase: " + igb.cb} placement="top">
                          <Link component={LinkRR} to={"/miner/" + igb.mn}>{igb.mn}</Link>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{d1}</Typography>
                        <Typography variant="body2">{d2}</Typography>
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>
                        <SecondaryTypo variant="body2">Fees excluding block reward</SecondaryTypo>
                      </TableCell>
                      <TableCell>
                        <SecondaryTypo variant="body2">Lost reward</SecondaryTypo>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Lost reward excluding not in our mempool transactions">
                          <SecondaryTypo variant="body2">Adjusted lost reward</SecondaryTypo>
                        </Tooltip>
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>
                        <Amount sats={igb.febr} unit={unit} setUnit={setUnit} btcusd={btcusd} onlyValue />
                        <Box sx={{clear: "left"}}>
                          <Amount unit={unit} setUnit={setUnit} onlyButton />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Amount sats={igb.lr} unit={unit} setUnit={setUnit} btcusd={btcusd} onlyValue />
                        <Box sx={{clear: "left"}}>
                          <Amount unit={unit} setUnit={setUnit} onlyButton />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Amount sats={igb.lreNIM} unit={unit} setUnit={setUnit} btcusd={btcusd} onlyValue />
                        <Box sx={{clear: "left"}}>
                          <Amount unit={unit} setUnit={setUnit} onlyButton />
                        </Box>
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>
                        <SecondaryTypo variant="body2">#Txs in mined block</SecondaryTypo>
                      </TableCell>
                      <TableCell>
                        <SecondaryTypo variant="body2">#Txs in our candidate block</SecondaryTypo>
                      </TableCell>
                      <TableCell>
                        <SecondaryTypo variant="body2">#Txs in mempool when mined</SecondaryTypo>
                      </TableCell>
                    </Styled6n1TableRow>
                    <Styled6n1TableRow>
                      <TableCell>{format(",")(igb.nInMB)}</TableCell>
                      <TableCell>{format(",")(igb.nInCB)}</TableCell>
                      <TableCell>{format(",")(igb.nInMP)}</TableCell>
                    </Styled6n1TableRow>
                  </React.Fragment>
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
