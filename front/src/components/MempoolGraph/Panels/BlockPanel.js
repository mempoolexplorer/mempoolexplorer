import React from "react";
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {ScaleCheckers} from "../ScaleCheckers/ScaleCheckers";
import {getNumberWithOrdinal} from "../../../utils/utils"
import {TDStackBarGraph} from "../TDStackBarGraph/TDStackBarGraph";
import {
  dataForBlockGraph
} from "../dataCreation";

export function BlockPanel(props) {
  const {data, onSatVByteSelected, blockBy, setBlockBy} = props;

  return (
    <>
      {data.blockSelected !== -1 && (
        <Grid item sx={{textAlign: 'center'}} >
          {data.blockSelected !== -1 && (
            <Typography>{getNumberWithOrdinal(data.blockSelected + 1)} block</Typography>
          )}
          <TDStackBarGraph
            data={dataForBlockGraph(
              data,
              onSatVByteSelected,
              data.satVByteSelected
            )}
            verticalSize={600}
            barWidth={300}
            by={blockBy}
          />
          <ScaleCheckers
            by={blockBy}
            leftText="Weight"
            rightText="Num Txs"
            onChange={setBlockBy}
            label="Scale by:"
          />
        </Grid>
      )
      }
    </>
  );
}
