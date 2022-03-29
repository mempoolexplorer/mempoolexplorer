import React, {useEffect, useState} from "react";
import {txMempoolPetitionTo} from "../../utils/utils";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import {AlgoTabs, getAlgoName} from "../Common/AlgoTabs";
import {TabPanel} from "../../utils/CommonComponents";
import {IgTable} from "./IgTable";
import {IgTableMobile} from "./IgTableMobile";
import {HashLink} from "react-router-hash-link";
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
        <Link component={HashLink} smooth to="/faq#ignoredTransactions">
          ignored
        </Link>{" "}
        when has been included in our{" "}
        <Link component={HashLink} smooth to="/faq#blockTemplate">
          block template
        </Link>{" "}
        using a{" "}
        <Link component={HashLink} smooth to="/faq#txSelAlgo">
          transaction selection algorithm
        </Link>{" "}
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
