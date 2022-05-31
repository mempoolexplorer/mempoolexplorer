import React, {useEffect, useState} from "react";
import {txMempoolPetitionTo} from "../../utils/utils";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import {AlgoTabs, getAlgoName} from "../Common/AlgoTabs";
import {TabPanel} from "../../utils/CommonComponents";
import {IgTable} from "./IgTable";
import {IgTableMobile} from "./IgTableMobile";
import {CHashLink} from "../../utils/CommonComponents";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function IgTransactionList(props) {
  const {setTitle} = props;
  const [igTxList, setIgTxList] = useState([]);
  const [algo, setAlgo] = useState(0);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("900"));

  useEffect(() => {
    setTitle("Ignored Transactions");
    txMempoolPetitionTo("/ignoredTxAPI/ignoredTxs/" + getAlgoName(algo), setIgTxList);
  }, [algo]);

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{mb: 2}}>{igTxList.length} ignored transactions in mempool</Typography>
      <Typography>
        A transaction is considered{" "}
        <CHashLink to="/faq#ignoredTransactions">
          ignored
        </CHashLink>{" "}
        when has been included in our{" "}
        <CHashLink to="/faq#blockTemplate">
          block template
        </CHashLink>{" "}
        using a{" "}
        <CHashLink to="/faq#txSelAlgo">
          transaction selection algorithm
        </CHashLink>{" "}
        but not has been mined.
      </Typography>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel value={algo} index={0}>
        {!mobile && <IgTable igTxList={igTxList} />}
        {mobile && <IgTableMobile igTxList={igTxList} />}
      </TabPanel>
      <TabPanel value={algo} index={1}>
        {!mobile && <IgTable igTxList={igTxList} />}
        {mobile && <IgTableMobile igTxList={igTxList} />}
      </TabPanel>
    </Box>
  );
}
