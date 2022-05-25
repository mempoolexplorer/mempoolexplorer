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
  const fitTabs = useMediaQuery(theme.breakpoints.up("415"));

  return (
    <Box sx={{borderBottom: 1, borderColor: 'divider', mt: 3}}>
      <SecondaryTypo align="center">Transaction selection algorithm:</SecondaryTypo>
      {<Tabs centered value={algo} onChange={onChange} aria-label="basic tabs example">
        {fitTabs && <Tab label="getBlockTemplate" />}
        {!fitTabs && <Tab label="getBlckTmplt" />}
        {fitTabs && <Tab label="onBlockArrival" />}
        {!fitTabs && <Tab label="onBlckArrvl" />}
      </Tabs>}
    </Box>
  );
}

export function getAlgoName(algo) {
  if (algo === 0) return "BITCOIND";
  if (algo === 1) return "OURS";
}

export function getAlgoNumber(algo) {
  if (algo === "BITCOIND") return 0;
  if (algo ===  "OURS") return 1;
}
