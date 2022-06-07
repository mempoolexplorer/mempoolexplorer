import React, {useState} from "react";
import {useTheme} from '@mui/material/styles';
import {format} from "d3-format";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {SecondaryTypo} from "../../utils/CommonComponents";
import {Amount} from "../Common/Amount";

function formatMinusOne(value, ret) {
  if (value === -1) {
    return ret;
  }
  return format(",")(value);
}

function formatSatVByte(fees, weight) {
  if (fees === -1) return "-";
  if (weight === -1) return "-";
  return format("6f")(fees / (weight / 4));
}

export function BlockStatsExElementMobile(props) {
  const {
    expanded,
    inMempool,
    inMinedBlock,
    inCandidateBlock,
    meaning,
    numTxs,
    weight,
    fees,
    unit,
    setUnit,
    btcusd
  } = props;

  const [exp, setExp] = useState(expanded);
  const theme = useTheme();

  function onExp() {
    setExp(!exp);
  }

  function expRowSpan() {
    if (exp) return "4";
    return "1";
  }

  function formatMinusOneFees(value, ret) {
    if (value === -1) {
      return ret;
    }
    return (
      <>
        <Amount sats={value} unit={unit} setUnit={setUnit} btcusd={btcusd} onlyValue />
        <Box sx={{clear: "left"}}>
          <Amount unit={unit} setUnit={setUnit} onlyButton />
        </Box>
      </>
    );
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{backgroundColor: theme.palette.action.disabledBackground}}>
        <TableCell colSpan={3} align="center"><SecondaryTypo>{meaning}</SecondaryTypo></TableCell >
      </TableRow>
      <TableRow>
        <TableCell ><SecondaryTypo>In mempool</SecondaryTypo></TableCell >
        <TableCell sx={{minWidth: 102}} ><SecondaryTypo>In mined block</SecondaryTypo></TableCell >
        <TableCell >
          <SecondaryTypo>In our candidate</SecondaryTypo> <SecondaryTypo>block</SecondaryTypo>
        </TableCell >
      </TableRow>
      <TableRow>
        <TableCell >{inMempool}</TableCell>
        <TableCell >{inMinedBlock}</TableCell >
        <TableCell >{inCandidateBlock}</TableCell >
      </TableRow>
      <TableRow>
        <TableCell># Txs:</TableCell >
        <TableCell>{formatMinusOne(numTxs, 0)}</TableCell >
        <TableCell rowSpan={expRowSpan()}>
          <IconButton onClick={onExp}>
            {exp === true && <KeyboardArrowUpIcon />}
            {exp === false && <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell >
      </TableRow>
      {
        exp === true && (
          <React.Fragment>
            <TableRow>
              <TableCell>
                <>&sum;</> Weight:
              </TableCell>
              <TableCell>{formatMinusOne(weight, "-")}</TableCell >
            </TableRow>
            <TableRow>
              <TableCell>
                <>&sum;</> Fees:
              </TableCell>
              <TableCell>
                {formatMinusOneFees(fees, "-")}
              </TableCell >
            </TableRow>
            <TableRow>
              <TableCell>Avg. Sat/VByte:</TableCell >
              <TableCell>{formatSatVByte(fees, weight)}</TableCell >
            </TableRow>
          </React.Fragment>
        )
      }
    </React.Fragment >
  );
}
