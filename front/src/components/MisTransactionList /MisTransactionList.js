import React, {useEffect, useState} from "react";
import {txMempoolPetitionTo} from "../../utils/utils";
import {HashLink} from "react-router-hash-link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import {AlgoTabs, getAlgoName} from "../Common/AlgoTabs";
import {TabPanel} from "../../utils/CommonComponents";
import {MisTable} from "./MisTable";

export function MisTransactionList(props) {
  const {setTitle} = props;
  const [misTxList, setMisTxList] = useState([]);
  const [algo, setAlgo] = useState(0);
  const [pageState, setPageState] = useState({page: 0, size: 10});

  useEffect(() => {
    setTitle("Missing Transactions");
    txMempoolPetitionTo(
      "/repudiatedTxAPI/repudiatedTxs/" +
      pageState.page +
      "/" +
      pageState.size +
      "/" +
      getAlgoName(algo),
      setMisTxList
    );
  }, [algo, pageState]);

  function onNextPage() {
    if (misTxList.length === pageState.size) {
      setPageState({...pageState, page: pageState.page + 1});
    }
  }

  function onPrevPage() {
    setPageState({...pageState, page: Math.max(0, pageState.page - 1)});
  }

  const setAlgorithm = (event, newValue) => {
    setAlgo(newValue);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{mb: 2}}>Missed transactions are transactions ignored more than 3 times.</Typography>
      <Typography>
        Causes of missing transactions are described{" "}
        <Link component={HashLink} smooth to="/faq#missingTxs">
          here
        </Link>
      </Typography>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel sx={{mt:2}} value={algo} index={0}>
        <MisTable misTxList={misTxList} algo={algo} />
      </TabPanel>
      <TabPanel sx={{mt:2}} value={algo} index={1}>
        <MisTable misTxList={misTxList} algo={algo}/>
      </TabPanel>
      <div>
        <button onClick={onPrevPage}>Prev</button>
        <button onClick={onNextPage}>Next</button>
      </div>
    </Box>
  );
}
