import LinearIcon from '@mui/icons-material/Timeline';
import {GraphIcon as NonLinearIcon, SecondaryTypo } from "../../utils/CommonComponents";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

export function GraphsArea(props) {

  const {txsGraphs, filterFunc, setGIndex, linear} = props;
  return (
    <Grid container justifyContent="center" spacing={2} marginTop={1}>
      {txsGraphs.filter(filterFunc)
        .map((txG) =>
          <Grid item key={txG.i}>
            <Card>
              <CardActionArea onClick={() => setGIndex(txG.i)}>
                <CardContent>
                  {!linear && <NonLinearIcon fontSize="small"/>}
                  {linear && <LinearIcon />}
                  <SecondaryTypo>
                    {"Graph #" + txG.i}
                  </SecondaryTypo>
                  <Typography>
                    {"Size: " + txG.txSet.length + " Txs"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )}
    </Grid>
  );
}
