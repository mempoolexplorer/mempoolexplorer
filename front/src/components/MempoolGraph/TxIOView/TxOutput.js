import React from "react";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import TableCell from "@mui/material/TableCell";
import {useTheme} from '@mui/material/styles';
import {Typography} from "@mui/material";
import {Amount} from "../../Common/Amount";
import useMediaQuery from '@mui/material/useMediaQuery';
const copy = require('clipboard-copy')

export function TxOutput(props) {
  const {txOutput, index, unit, setUnit, btcusd} = props;
  const theme = useTheme();
  const fitTxO = useMediaQuery(theme.breakpoints.up("800"));

  return (
    <>
      {fitTxO &&
        <TableRow>
          <TableCell><Typography variant="body2" fontWeight={theme.typography.fontWeightBold} color={theme.palette.grey[600]}>#{index}</Typography></TableCell>
          {txOutput.address !== null &&
            <>
              <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >
                {txOutput.address}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => {
                  copy(txOutput.address);
                }}
                  style={{width: 20, height: 20}}
                  sx={{ml: 1}}
                >
                  <ContentCopyIcon
                    style={{width: 20, height: 20}}
                  >
                  </ContentCopyIcon >
                </IconButton>
              </TableCell>
            </>
          }
          {txOutput.address === null &&
            <>
              <TableCell></TableCell>
              <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >Non Standard Output (no address)</TableCell>
            </>
          }
          <TableCell>
            <Amount sats={txOutput.amount} unit={unit} setUnit={setUnit} btcusd={btcusd} />
          </TableCell>
        </TableRow>
      }
      {!fitTxO &&
        <>
          <TableRow>
            <TableCell rowSpan="2"><Typography variant="body2" fontWeight={theme.typography.fontWeightBold} color={theme.palette.grey[600]}>#{index}</Typography></TableCell>
            {txOutput.address !== null &&
              <>
                <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >
                  {txOutput.address}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    copy(txOutput.address);
                  }}
                    style={{width: 20, height: 20}}
                    sx={{ml: 1}}
                  >
                    <ContentCopyIcon
                      style={{width: 20, height: 20}}
                    >
                    </ContentCopyIcon >
                  </IconButton>
                </TableCell>
              </>
            }
            {txOutput.address === null &&
              <>
                <TableCell></TableCell>
                <TableCell sx={{wordWrap: "break-word", wordBreak: "break-word"}} >Non Standard Output (no address)</TableCell>
              </>
            }
          </TableRow>
          <TableRow>
            <TableCell colSpan="2">
              <Box textAlign="right">
                <Amount sats={txOutput.amount} unit={unit} setUnit={setUnit} btcusd={btcusd} />
              </Box>
            </TableCell>
          </TableRow>
        </>
      }
    </>
  );
}
