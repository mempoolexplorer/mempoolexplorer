import React, {useState, useEffect} from "react";
import {MinersStatsList} from "./MinersStatsList";
import {txMempoolPetitionTo} from "../../utils/utils";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {MinersStatsListMobile} from "./MinersStatsListMobile";

export function MinersStats(props) {
  const {setTitle} = props;

  const [minerSL, setMinerSL] = useState([]);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("1000"));

  useEffect(() => {
    setTitle("Miners Statistics");
    txMempoolPetitionTo("/minersStatsAPI/historicStats", setMinerSL);
  }, []);

  return (
    <>
      {mobile && minerSL !== undefined && minerSL.minerStatsList !== undefined && <MinersStatsListMobile minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} />}
      {!mobile && minerSL !== undefined && minerSL.minerStatsList !== undefined && <MinersStatsList minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} />}
    </>
  );
}
