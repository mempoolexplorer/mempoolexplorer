import React from "react";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {useMediaQuery} from 'react-responsive';
import {useWindowSize} from "../../../../hooks/windowSize";
import {ScaleCheckers} from "../../ScaleCheckers/ScaleCheckers";
import {TDStackBarGraph} from "../../TDStackBarGraph/TDStackBarGraph";
import {TxSpeedGraph} from "../../TxSpeedGraph/TxSpeedGraph";
import {
  dataForMiningQueueGraph,
} from "../../dataCreation";

export function MempoolPanel(props) {
  const {data, onBlockSelected, mempoolBy, setMempoolBy} = props;

  const graphNotFit = useMediaQuery({query: '(max-width: 600px)'})
  const wSize = useWindowSize();

  return (
    <>
      {data.mempool !== undefined && data.mempool !== null && <Grid item>
        <Box sx={{
          display: 'grid',
          gridTemplateRows: '[label] auto [graph] auto [checkers] auto [endRow]',
          gridTemplateColumns: '[txSpeed] auto [graph] auto [endColumn]'
        }}>
          <Box sx={{gridArea: 'label / graph / graph / endColumn', textAlign: 'center'}}>
            <Typography>{"Current Bitcoin Mempool (" + data.mempool.length + " blocks)"}</Typography>
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gridArea: 'graph / txSpeed / checkers/ graph',
            justifySelf: 'end'
          }}>
            <div className="pad"></div>
            <TxSpeedGraph
              height="150"
              width={graphNotFit ? wSize.width / 15 : 50}
              barWidth="30"
              speed={data.weightInLast10minutes}
            />
          </Box>
          <Box sx={{gridArea: 'graph / graph / checkers/ endColumn'}}>
            <TDStackBarGraph
              data={dataForMiningQueueGraph(
                data,
                onBlockSelected,
                data.blockSelected
              )}
              verticalSize={600}
              // barWidth={graphNotFit ? wSize.width / 4.4 : 300}
              barWidth={graphNotFit ? 200 - ((600 - wSize.width) * 0.5) : 300}
              by={mempoolBy}
            />
          </Box>
          <Box sx={{gridArea: 'checkers/ graph / endRow / endColumn', textAlign: 'center'}}>
            <ScaleCheckers
              by={mempoolBy}
              leftText="Weight"
              rightText="Num Txs"
              onChange={setMempoolBy}
              label="Scale by:"
            />
          </Box>
        </Box>
      </Grid>}
    </>
  );
}
