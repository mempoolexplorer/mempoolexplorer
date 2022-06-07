import React from "react";
import {format} from "d3-format";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Typography from "@mui/material/Typography";
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

export function BlockStatsExElement(props) {
  const {
    first,
    expanded,
    setExpanded,
    lateralMsg,
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

  function formatMinusOneFees(value, ret) {
    if (value === -1) {
      return ret;
    }
    return (
      <Amount sats={value} unit={unit} setUnit={setUnit} btcusd={btcusd} />
    );
  }

  function onExp() {
    setExpanded(!expanded);
  }

  function expRowSpan() {
    if (expanded) return "4";
    return "1";
  }

  return (
    <React.Fragment>
      <TableRow
        style={{
          ...(expanded === true && first === false && {borderTop: "3px solid grey"})
        }}
      >
        {lateralMsg !== "" && (
          <TableCell rowSpan="32" sx={{maxWidth: 60}} >
            <Typography component="span" sx={{
              msWritingMode: "tb-rl",
              webkitWritingMode: "vertical-rl",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              whiteSpace: "nowrap"
            }}>{lateralMsg}</Typography>
          </TableCell >
        )}
        <TableCell rowSpan={expRowSpan()}>{inMempool}</TableCell>
        <TableCell rowSpan={expRowSpan()}>{inMinedBlock}</TableCell >
        <TableCell rowSpan={expRowSpan()}>{inCandidateBlock}</TableCell >
        <TableCell rowSpan={expRowSpan()}>{meaning}</TableCell >
        <TableCell># Txs:</TableCell >
        <TableCell>{formatMinusOne(numTxs, 0)}</TableCell >
        <TableCell rowSpan={expRowSpan()}>
          <IconButton onClick={onExp}>
            {expanded === true && <KeyboardArrowUpIcon />}
            {expanded === false && <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell >
      </TableRow>
      {
        expanded === true && (
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
              </TableCell>
            </TableRow>
            <TableRow
              style={{
                ...(expanded === true && {borderBottom: "3px solid grey"})
              }}
            >
              <TableCell>Avg. Sat/VByte:</TableCell >
              <TableCell>{formatSatVByte(fees, weight)}</TableCell >
            </TableRow>
          </React.Fragment>
        )
      }
    </React.Fragment >
  );
}
