import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from '@mui/material/LinearProgress';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from '@mui/material/Tooltip';
import {formatDuration, intervalToDuration} from "date-fns";
import React from "react";
import {CHashLink} from "../../../utils/CommonComponents";
import {filteredGetNumberWithOrdinal, splitStrDate} from "../../../utils/utils";
import {TablePaginationActions} from "../../Common/TablePaginationActions";

export function TableView(props) {
  const {data, algo, rowsPerPage} = props;
  const node = props.node;
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //Not going to happen.
  };

  function IgBlockCells(props) {
    const {igBlocks} = props;
    return (
      <>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((ib) => {
          return (
            <TableCell key={ib.height + "height"}>
              <CHashLink to={"/block/" + ib.height + "/" + algo}>
                {ib.height}
              </CHashLink>
            </TableCell>
          );
        })}
      </>
    )
  }

  function TextCells(props) {
    const {igBlocks, numFunc} = props;
    return (
      <>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => (
          <TableCell key={igBlk.height}>
            {numFunc(igBlk)}
          </TableCell>
        ))}
      </>
    )
  }

  function ProgressCells(props) {
    const {igBlocks} = props;
    return (
      <>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => {
          return (
            <TableCell key={igBlk.height}>
              <LinearProgress variant="determinate" value={(igBlk.posInCandidateBlock * 100) / igBlk.txsInCandidateBlock} />
            </TableCell>
          );
        })}
      </>
    )
  }

  function DateCells(props) {
    const {igBlocks} = props;
    return (
      <>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => {
          const [d1, d2] = splitStrDate(new Date(igBlk.time).toISOString());
          return (
            <TableCell key={igBlk.height}>
              <Typography variant="body2">{d1}</Typography>
              <Typography variant="body2">{d2}</Typography>
            </TableCell>
          );
        })}
      </>
    )
  }

  function MinersCells(props) {
    const {igBlocks} = props;
    return (
      <>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => {
          return (
            <Tooltip key={igBlk.height + "minerNameToolTip"} title={"Coinbase: " + igBlk.coinBaseData.ascciOfField}>
              <TableCell key={igBlk.height + "minerName"}>
                <CHashLink to={"/miner/" + igBlk.coinBaseData.minerName}>
                  {igBlk.coinBaseData.minerName}
                </CHashLink>
              </TableCell>
            </Tooltip>
          );
        })}
      </>
    )
  }

  return (
    <Grid container justifyContent="center" sx={{mt: 2}}>
      <Grid item>
        <Box align="center">
          <TableContainer component={Paper}>
            <Table size="small" aria-label="Ignored txs Table">
              <TableBody>
                <TableRow>
                  <TableCell>Block#</TableCell>
                  <IgBlockCells igBlocks={data.ignoringBlocks} />
                </TableRow>
                <TableRow>
                  <TableCell>#Txs in mined block</TableCell>
                  <TextCells igBlocks={data.ignoringBlocks}
                    numFunc={(igblk) => {return igblk.txsInMinedBlock === -1 ? "(empty)" : igblk.txsInMinedBlock;}}
                  />
                </TableRow>
                <TableRow>
                  <TableCell>Position in candidate block</TableCell>
                  <TextCells igBlocks={data.ignoringBlocks}
                    numFunc={(igblk) => {return "(" + filteredGetNumberWithOrdinal(igblk.posInCandidateBlock + 1) + "/" + igblk.txsInCandidateBlock + ")";}}
                  />
                </TableRow>
                <TableRow>
                  <TableCell>Position in candidate block</TableCell>
                  <ProgressCells igBlocks={data.ignoringBlocks} />
                </TableRow>
                <TableRow>
                  <TableCell>Block Time</TableCell>
                  <DateCells igBlocks={data.ignoringBlocks} />
                </TableRow>
                <TableRow>
                  <TableCell>Delta Time</TableCell>
                  <TextCells igBlocks={data.ignoringBlocks}
                    numFunc={(igblk) => {return getDeltaStr(node.t, igblk.time);}}
                  />
                </TableRow>
                <TableRow>
                  <TableCell>Mining Pool</TableCell>
                  <MinersCells igBlocks={data.ignoringBlocks} />
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    colSpan={3}
                    count={data.ignoringBlocks.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
}
function getDeltaStr(txTime, iBlockTime) {
  const duration = intervalToDuration({
    start: new Date(txTime),
    end: new Date(iBlockTime),
  });
  const durationStr = formatDuration(duration);
  if (durationStr === undefined) return "0 seconds";
  return durationStr;
}
