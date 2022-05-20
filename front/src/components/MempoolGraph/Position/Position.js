import React, {useState} from "react";
import Table from "@mui/material/Table";
import Box from '@mui/material/Box';
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {format} from "d3-format";
import {durationMins, getNumberWithOrdinal} from "../../../utils/utils";
import "./Position.css";

export function Position(props) {
  const data = props.data;
  const [expanded, setExpanded] = useState(false);
  const [posInBlock, aheadWeightInBlock] = data.txIdSelected !== "" ? calcPositionsInBlock() : [0, 0];
  const [aheadTx, aheadWeight] = data.txIdSelected !== "" ? calcAhead() : [0, 0];
  const totalWeight = data.txIdSelected !== "" ? calcTotalWeight : 0;
  const totalTxs = data.txIdSelected !== "" ? calcTotalTxs : 0;
  // TODO: Hook here
  return (
    <>
      {data.txIdSelected !== "" &&

        <Accordion expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          sx={{mt: 1}}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="PositionView"
            id="PositionView-header"
            sx={{'& .MuiAccordionSummary-content': {justifyContent: "center"}}}
          >
            <Typography align="center" variant="h5">Time to be mined: ~ {durationMins(etaMin())} </Typography>
          </AccordionSummary>
          <AccordionDetails >

            <Grid container justifyContent="center">
              <Grid item>
                <Box align="center">
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                      <TableBody >
                        <TableRow >
                          <TableCell >Transaction is in:</TableCell >
                          <TableCell colSpan="2">{getNumberWithOrdinal(data.blockSelected + 1)} block
                          </TableCell >
                        </TableRow >
                        <TableRow >
                          <TableCell >Position in block:</TableCell >
                          <TableCell >{percentage(posInBlock, getTotalTxInBlock())}%</TableCell >
                          <TableCell > {getNumberWithOrdinal(posInBlock)} of {getTotalTxInBlock()} transactions </TableCell >
                        </TableRow >
                        <TableRow >
                          <TableCell >Position in block (weight):</TableCell >
                          <TableCell >{percentage(aheadWeightInBlock, getTotalWeighInBlock())}%</TableCell >
                          <TableCell > {format(",")(aheadWeightInBlock)} vBytes of {format(",")(getTotalWeighInBlock())} vBytes </TableCell >
                        </TableRow >
                        <TableRow >
                          <TableCell >Total transactions ahead:</TableCell >
                          <TableCell colSpan="2">{aheadTx}</TableCell >
                        </TableRow >
                        <TableRow >
                          <TableCell >Total weight ahead:</TableCell >
                          <TableCell colSpan="2">{format(",")(aheadWeight)} vBytes</TableCell >
                        </TableRow >
                      </TableBody >
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      }
    </>
  );

  function etaMin() {//Pulled out of my sleeve
    const weightToAdd = data.weightInLast10minutes * (data.blockSelected + 1);
    const mempoolSize = calcTotalWeight();
    const adjustedMPSize = mempoolSize + weightToAdd;
    const ratio = adjustedMPSize / mempoolSize;
    const adjustedAheadWeight = aheadWeight * ratio;
    const adjustedMiningBlock = Math.trunc(adjustedAheadWeight / 4000000);
    return (adjustedMiningBlock + 1) * 10;
  }

  function calcTotalWeight() {
    let totalWeight = 0;
    data.mempool.forEach((element) => {
      totalWeight += element.w;
    });
    return totalWeight;
  }

  function calcTotalTxs() {
    let totalTxs = 0;
    data.mempool.forEach((element) => {
      totalTxs += element.n;
    });
    return totalTxs;
  }

  function calcAhead() {
    let aheadWeight = 0;
    let aheadTx = 0;
    data.mempool.every((element, index) => {
      if (index === data.blockSelected) {
        return false;
      }
      aheadWeight += element.w;
      aheadTx += element.n;
      return true;
    });
    aheadWeight += aheadWeightInBlock;
    aheadTx += posInBlock;
    return [aheadTx - 1, aheadWeight];
  }

  function calcPositionsInBlock() {
    let sumWeight = 0;
    let sumPos = 0;

    data.blockHistogram.every((element) => {
      if (data.satVByteSelected === element.m) {
        return false;
      }
      sumWeight += element.w;
      sumPos += element.n;
      return true;
    });

    sumPos += data.txIndexSelected + 1;

    data.satVByteHistogram.every((element, index) => {
      if (index === data.txIndexSelected) {
        return false;
      }
      sumWeight += element.w;
      return true;
    })

    return [sumPos, sumWeight];
  }

  function percentage(partialValue, totalValue) {
    return ((100 * partialValue) / totalValue).toFixed(2);
  }

  function getTotalTxInBlock() {
    return data.mempool[data.blockSelected].n;
  }

  function getTotalWeighInBlock() {
    return data.mempool[data.blockSelected].w;
  }
}
