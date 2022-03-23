import React from "react";
import {durationMins} from "../../utils/utils";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {styled} from '@mui/material/styles';


export function TableFees(props) {
  const {feeList, estimationType, header} = props;

const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  borderColor: theme.palette.grey[300],
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.disabledBackground,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

  return (
    <Box align="center">
      {header && <Typography sx={{mb: 2, mt:2}} align="center" variant="h5">{estimationType} estimation</Typography>} 
      <TableContainer component={Paper}>
        <Table sx={{maxWidth: 400}} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow >
              <HeaderTableCell >Target Time</HeaderTableCell >
              <HeaderTableCell >Target Block</HeaderTableCell >
              <HeaderTableCell >Suggested fees (Sat/VByte)</HeaderTableCell >
            </TableRow>
          </TableHead>
          <TableBody>
            {feeList.map((fee, i) => (
              <StyledTableRow 
                key={i}
              >
                <TableCell>~{durationMins(fee.tb * 10)}</TableCell>
                <TableCell>{fee.tb}</TableCell>
                <TableCell>
                  {fee.fr} ({Math.round(fee.fr)})
                </TableCell>
              </StyledTableRow >
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
