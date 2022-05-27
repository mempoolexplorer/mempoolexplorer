import React from "react";
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import {useMediaQuery} from 'react-responsive';
import {useWindowSize} from "../../../../hooks/windowSize";
import {ScaleCheckers} from "../../ScaleCheckers/ScaleCheckers";
import {getNumberWithOrdinal} from "../../../../utils/utils"
import {TDStackBarGraph} from "../../TDStackBarGraph/TDStackBarGraph";
import {
    dataForTxsGraph
} from "../../dataCreation";

export function TxsPanel(props) {
    const {data, onTxIndexSelected, jumpOnSatVByteRef, txsBy, setTxsBy} = props;
    const graphNotFit = useMediaQuery({query: '(max-width: 500px)'})
    const wSize = useWindowSize();

    return (
        <>
            {data.satVByteSelected !== -1 && (
                <>
                    <Divider flexItem sx={{my: 2}} />
                    <Grid item sx={{textAlign: 'center'}} ref={jumpOnSatVByteRef}>
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
                            barWidth={graphNotFit ? 300 - (500 - wSize.width) : 300}
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
                </>
            )}
        </>
    );
}
