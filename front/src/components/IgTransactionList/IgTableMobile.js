import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import {Styled4n1TableRow} from "../../utils/CommonComponents";
import {intervalToDuration, formatDuration} from "date-fns";
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";
import {Typography} from "@mui/material";
import {useTheme} from '@mui/material/styles';

export function IgTableMobile(props) {
  const {igTxList} = props;
  const theme = useTheme();

  function duration(seconds) {
    const durationStr = formatDuration(
      intervalToDuration({
        start: new Date(0, 0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, 0, seconds),
      })
    );
    if (durationStr === undefined) return "0 seconds";
    return durationStr;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table sx={{wordWrap: "break-word", wordBreak: "break-word"}} size="small" aria-label="Ignored txs Table mobile">
              <TableBody>
                {igTxList.map((igTx) => (
                  <React.Fragment key={"data" + igTx.i + igTx.n} >
                    <Styled4n1TableRow>
                      <TableCell colSpan="2">
                        <Typography>Transaction Id:</Typography>
                        <Link component={HashLink} smooth
                          to={"/mempool/" + igTx.i + "#ignoringTxsSection"} >
                          {igTx.i}
                        </Link>
                      </TableCell>
                    </Styled4n1TableRow>
                    <Styled4n1TableRow >
                      <TableCell><Typography variant="body2" color={theme.palette.text.secondary}>#Times Ignored</Typography></TableCell>
                      <TableCell sx={{textAlign: "end"}}><Typography variant="body2" color={theme.palette.text.secondary}>Biggest Delta</Typography></TableCell>
                    </Styled4n1TableRow>
                    <Styled4n1TableRow >
                      <TableCell>{igTx.n}</TableCell>
                      <TableCell sx={{textAlign: "end"}}>{duration(igTx.s)}</TableCell>
                    </Styled4n1TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid >
    </Grid >
  );
}
