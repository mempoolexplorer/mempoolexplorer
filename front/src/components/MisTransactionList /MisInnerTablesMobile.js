import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from '@mui/material/Tooltip';
import {StyledTableRow} from "../../utils/CommonComponents";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import LinearProgress from '@mui/material/LinearProgress';
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import {HashLink} from "react-router-hash-link";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import {format} from "d3-format";
import {TablePaginationActions} from "../Common/TablePaginationActions";
import {getAlgoName} from "../Common/AlgoTabs";
import {filteredGetNumberWithOrdinal, splitStrDate} from "../../utils/utils";
import {useTheme} from '@mui/material/styles';

export function MisInnerTablesMobile(props) {
  const {mTx, algo} = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function IgnoringMiners(props) {
    const {igBl} = props;
    const minerNamesSet = new Set();
    igBl.forEach((ig) => {
      minerNamesSet.add(ig.coinBaseData.minerName);
    });
    var a = [...minerNamesSet];
    if (minerNamesSet.size === 1) {
      return (<Typography>{a[0]}</Typography>);
    }
    return (
      <React.Fragment>
        <Typography component="span" sx={{fontWeight: 'bold'}}>{a.slice(0, -1).join(", ")}  </Typography>
        <Typography component="span"> and </Typography>
        <Typography component="span" sx={{fontWeight: 'bold'}}>{a.slice(-1)}</Typography >
      </React.Fragment>
    )
  };

  function TextCells(props) {
    const {igBlocks, numFunc, nameProp} = props;
    return (
      <React.Fragment>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => (
          <TableCell key={igBlk.height}>
            {numFunc(igBlk)}
          </TableCell>
        ))}
      </React.Fragment>
    )
  }

  function DateCells(props) {
    const {igBlocks} = props;
    return (
      <React.Fragment>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => {
          const [d1, d2] = splitStrDate(new Date(igBlk.time).toISOString());
          return (
            <TableCell key={igBlk.height} sx={{minWidth: 110}}>
              <Typography variant="body2">{d1}</Typography>
              <Typography variant="body2">{d2}</Typography>
            </TableCell>
          );
        })}
      </React.Fragment>
    )
  }

  function ProgressCells(props) {
    const {igBlocks} = props;
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }

  function MinersCells(props) {
    const {igBlocks} = props;
    return (
      <React.Fragment>
        {(rowsPerPage > 0
          ? igBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          : igBlocks
        ).map((igBlk) => {
          return (
            <Tooltip key={igBlk.height + "minerNameToolTip"} title={"Coinbase: " + igBlk.coinBaseData.ascciOfField} placement="top">
              <TableCell key={igBlk.height + "minerName"}>
                <Link component={HashLink} smooth to={"/miner/" + igBlk.coinBaseData.minerName}>
                  {igBlk.coinBaseData.minerName}
                </Link>
              </TableCell>
            </Tooltip>
          );
        })}
      </React.Fragment>
    )
  }

  return (
    <Box sx={{margin: 1}}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <StyledTableRow>
              <Tooltip title="Sum of (Tx.satByte-blockMinSatBytes) for each ignoring block">
                <TableCell><Typography variant="body2" color={theme.palette.text.secondary}>Total Sat/vByte lost</Typography></TableCell>
              </Tooltip>
            </StyledTableRow>
            <StyledTableRow>
              <Tooltip title="TotalSatvBytesLost*tx.vSize">
                <TableCell><Typography variant="body2">{format(".6f")(mTx.totalSatvBytesLost)}</Typography></TableCell>
              </Tooltip>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell><Typography variant="body2" color={theme.palette.text.secondary}>Total fees lost</Typography></TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell><Typography variant="body2">{format(",")(mTx.totalFeesLost)}</Typography></TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell><Typography variant="body2" color={theme.palette.text.secondary}>Time when should had been mined</Typography></TableCell>
            </StyledTableRow>
            <StyledTableRow>
              <TableCell><Typography variant="body2">{mTx.timeWhenShouldHaveBeenMined}</Typography></TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography sx={{m: 2}}>Ignoring miners:<b> <IgnoringMiners igBl={mTx.ignoringBlocks} /></b></Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <TableRow>
              <TableCell>Ignoring Block #</TableCell>
              {(rowsPerPage > 0
                ? mTx.ignoringBlocks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : mTx.ignoringBlocks
              ).map((igBlk) => (
                <TableCell key={igBlk.height}>
                  <Link component={HashLink} smooth to={"/block/" + igBlk.height + "/" + getAlgoName(algo)}>
                    {igBlk.height}
                  </Link>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell>#Txs in mined block</TableCell>
              <TextCells igBlocks={mTx.ignoringBlocks}
                numFunc={(igblk) => {return igblk.txsInMinedBlock === -1 ? "(empty)" : igblk.txsInMinedBlock;}}
                nameProp={"TxsInMinedBlock"} />
            </TableRow>
            <TableRow>
              <TableCell>#Txs in our candidate block</TableCell>
              <TextCells igBlocks={mTx.ignoringBlocks} numFunc={(igblk) => igblk.txsInCandidateBlock} nameProp={"txsInCandidateBlock"} />
            </TableRow>
            <TableRow>
              <TableCell>Position in our candidate block</TableCell>
              <TextCells igBlocks={mTx.ignoringBlocks} numFunc={(igblk) => filteredGetNumberWithOrdinal(igblk.posInCandidateBlock + 1)} nameProp={"posInCandidateBlock "} />
            </TableRow>
            <TableRow>
              <TableCell>Position in our candidate block</TableCell>
              <ProgressCells igBlocks={mTx.ignoringBlocks} />
            </TableRow>
            <TableRow>
              <TableCell>Block Time</TableCell>
              <DateCells igBlocks={mTx.ignoringBlocks} />
            </TableRow>
            <TableRow>
              <TableCell>Miner Name</TableCell>
              <MinersCells igBlocks={mTx.ignoringBlocks} />
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                colSpan={3}
                count={mTx.ignoringBlocks.length}
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
  );
}
