import React, {useState} from "react";
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import {useMediaQuery} from 'react-responsive';
import {useWindowSize} from "../../../../hooks/windowSize";
import {ScaleCheckers} from "../../ScaleCheckers/ScaleCheckers";
import {getNumberWithOrdinal} from "../../../../utils/utils"
import {TDStackBarGraph} from "../../TDStackBarGraph/TDStackBarGraph";
import {
  dataForBlockGraph
} from "../../dataCreation";

export function BlockPanel(props) {
  const {data, onSatVByteSelected} = props;
  const [blockBy, setBlockBy] = useState("byBoth");
  const graphNotFit = useMediaQuery({query: '(max-width: 500px)'})
  const wSize = useWindowSize();

  return (
    <>
      {data.blockSelected !== -1 && (
        <>
          <Divider flexItem sx={{my: 2}} />
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
              barWidth={graphNotFit ? 300 - (500 - wSize.width) : 300}
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
        </>
      )
      }
    </>
  );
}
