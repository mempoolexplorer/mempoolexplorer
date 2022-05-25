import React from "react";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {satsToBTC} from "./amount";

export function TxInput(props) {
  const {txInput, index} = props;

  return (
    <TableRow>
      <TableCell>#{index}</TableCell>
      <TableCell>
        {txInput.txId}:{txInput.voutIndex}
      </TableCell>
      <TableCell>
        <Box>{satsToBTC(txInput.amount)}</Box>
        <Box>BTC</Box>
      </TableCell>
    </TableRow>
  );
}
