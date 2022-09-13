import React, {useState, useEffect} from "react";
import {MinersStatsList} from "./MinersStatsList";
import {txMempoolPetitionTo} from "../../utils/utils";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {MinersStatsListMobile} from "./MinersStatsListMobile";
import {AccordionMinerStats} from "./AccordionMinerStats";
import {AlgoTabs, getAlgoName} from "../Common/AlgoTabs";
import {TabPanel} from "../../utils/CommonComponents";

export function MinersStats(props) {
  const {setTitle} = props;

  const [minerSL, setMinerSL] = useState([]);
  const [algo, setAlgo] = useState(0);
  const [unit, setUnit] = useState("SAT");
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("1300"));

  useEffect(() => {
    setTitle("Mining Pools Statistics");
    txMempoolPetitionTo("/minersStatsAPI/historicStats", setMinerSL);
  }, []);

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  if (minerSL === undefined || minerSL.minerStatsList === undefined) return null;
  else return (
    <>
      <AccordionMinerStats mobile={mobile}>
        <span>Total lost fees because of ignored transactions per mining pool</span>
      </AccordionMinerStats>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        {mobile && <MinersStatsListMobile minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} algo={getAlgoName(algo)} unit={unit} setUnit={setUnit} />}
        {!mobile && <MinersStatsList minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} algo={getAlgoName(algo)} unit={unit} setUnit={setUnit} />}
      </TabPanel>
      <TabPanel value={algo} index={1}>
        {mobile && <MinersStatsListMobile minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} algo={getAlgoName(algo)} unit={unit} setUnit={setUnit} />}
        {!mobile && <MinersStatsList minersStatsList={minerSL.minerStatsList} btcusd={minerSL.btcPrice} algo={getAlgoName(algo)} unit={unit} setUnit={setUnit} />}
      </TabPanel>
    </>
  );
}
