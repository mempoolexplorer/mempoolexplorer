import React from "react";
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import {ScaleCheckers} from "../ScaleCheckers/ScaleCheckers";
import {getNumberWithOrdinal} from "../../../utils/utils"
import {TDStackBarGraph} from "../TDStackBarGraph/TDStackBarGraph";
import {
    dataForTxsGraph
} from "../dataCreation";

export function TxsPanel(props) {
    const {data, onTxIndexSelected, txsBy, setTxsBy} = props;
    return (
        <>
            {data.satVByteSelected !== -1 && (
                <Grid item sx={{textAlign: 'center'}} >
                    {data.satVByteSelected !== -1 && (
                        <Typography component='span'>
                            SatVByte: {data.satVByteSelected}
                            {data.txIndexSelected !== -1 && (
                                <Typography component='span'>
                                    / Position: {getNumberWithOrdinal(data.txIndexSelected + 1)}
                                </Typography>
                            )}
                        </Typography>
                    )}
                    <TDStackBarGraph
                        data={dataForTxsGraph(
                            data,
                            onTxIndexSelected,
                            data.txIndexSelected
                        )}
                        verticalSize={600}
                        barWidth={300}
                        by={txsBy}
                    />
                    <ScaleCheckers
                        by={txsBy}
                        leftText="Weight"
                        rightText="Num Txs"
                        onChange={setTxsBy}
                        label="Scale by:"
                    />
                </Grid>
            )}
        </>
    );
}
