import React from "react";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {satsToBTC} from "./amount";
import {Typography} from "@mui/material";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export function TxInput(props) {
  const {txInput, index} = props;
  const theme = useTheme();
  const fitTxI = useMediaQuery(theme.breakpoints.up("900"));

  return (
    <>
      {fitTxI &&
        <TableRow>
          <TableCell><Typography variant="body2" fontWeight={theme.typography.fontWeightBold} color={theme.palette.grey[600]}>#{index}</Typography></TableCell>
          <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >
            {txInput.txId}:{txInput.voutIndex}
          </TableCell>
          <TableCell>
            <Box>{satsToBTC(txInput.amount) + " BTC"}</Box>
          </TableCell>
        </TableRow>
      }
      {
        !fitTxI &&
        <>
          <TableRow>
            <TableCell rowSpan="2"><Typography variant="body2" fontWeight={theme.typography.fontWeightBold} color={theme.palette.grey[600]}>#{index}</Typography></TableCell>
            <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >
              {txInput.txId}:{txInput.voutIndex}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Box textAlign="right">{satsToBTC(txInput.amount) + " BTC"}</Box>
            </TableCell>
          </TableRow>
        </>
      }
    </>
  );
}
