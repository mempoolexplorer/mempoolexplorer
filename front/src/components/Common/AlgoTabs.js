import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {SecondaryTypo} from "../../utils/CommonComponents";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function AlgoTabs(props) {
  const {onChange, algo} = props;
  const theme = useTheme();
  const fitTabs = useMediaQuery(theme.breakpoints.up("400"));

  return (
    <Box sx={{borderBottom: 1, borderColor: 'divider', mt: 3}}>
      <SecondaryTypo align="center">Transaction selection algorithm:</SecondaryTypo>
      {<Tabs centered value={algo} onChange={onChange} aria-label="basic tabs example">
        {fitTabs && <Tab label="getBlockTemplate" />}
        {!fitTabs && <Tab label="getBlckTemplt." />}
        {fitTabs &&<Tab label="onBlockArrival" />}
        {!fitTabs &&<Tab label="onBlckArrival." />}
      </Tabs>}
    </Box>
  );
}

export function getAlgoName(algo) {
  if (algo === 0) return "BITCOIND";
  if (algo === 1) return "OURS";
}
