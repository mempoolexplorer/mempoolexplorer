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


export function TableFees(props) {
  const {feeList, estimationType, header} = props;

  return (
    <Box align="center">
      {header===true && <Typography sx={{mb: 2}} align="center" variant="h5">{estimationType} estimation</Typography>} 
      <TableContainer component={Paper}>
        <Table sx={{maxWidth: 400}} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Target Time</TableCell>
              <TableCell>Target Block</TableCell>
              <TableCell>Suggested fees (Sat/VByte)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeList.map((fee, i) => (
              <TableRow
                key={i}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell>~{durationMins(fee.tb * 10)}</TableCell>
                <TableCell>{fee.tb}</TableCell>
                <TableCell>
                  {fee.fr} ({Math.round(fee.fr)})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
