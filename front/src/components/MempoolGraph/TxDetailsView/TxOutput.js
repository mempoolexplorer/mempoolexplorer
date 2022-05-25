import React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {satsToBTC} from "./amount";

export function TxOutput(props) {
  const {txOutput, index} = props;

  return (
    <TableRow>
      <TableCell>#{index}</TableCell>
      {txOutput.address !== null && <TableCell>{txOutput.address} </TableCell>}
      {txOutput.address === null && <TableCell>Non Standard Output (no address)</TableCell>}
      <TableCell>
        <div>{satsToBTC(txOutput.amount)}</div> <div>BTC</div>
      </TableCell>
    </TableRow>
  );
}
