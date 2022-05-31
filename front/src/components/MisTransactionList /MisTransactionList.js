import React, {useEffect, useState} from "react";
import {txMempoolPetitionTo} from "../../utils/utils";
import {HashLink} from "react-router-hash-link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"
import { CHashLink } from "../../utils/CommonComponents";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import IconButton from '@mui/material/IconButton';
import {AlgoTabs, getAlgoName} from "../Common/AlgoTabs";
import {TabPanel} from "../../utils/CommonComponents";
import {MisTable} from "./MisTable";
import {MisTableMobile} from "./MisTableMobile";
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

export function MisTransactionList(props) {
  const {setTitle} = props;
  const [misTxList, setMisTxList] = useState([]);
  const [algo, setAlgo] = useState(0);
  const [pageState, setPageState] = useState({page: 0, size: 10});
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("900"));

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
        <CHashLink component={HashLink} smooth to="/faq#missingTxs">
          here
        </CHashLink>
      </Typography>
      <AlgoTabs onChange={setAlgorithm} algo={algo} />
      <TabPanel sx={{mt: 2}} value={algo} index={0}>
        {!mobile && <MisTable misTxList={misTxList} algo={algo} />}
        {mobile && <MisTableMobile misTxList={misTxList} algo={algo} />}
      </TabPanel>
      <TabPanel sx={{mt: 2}} value={algo} index={1}>
        {!mobile && <MisTable misTxList={misTxList} algo={algo} />}
        {mobile && <MisTableMobile misTxList={misTxList} algo={algo} />}
      </TabPanel>
      <Grid container justifyContent="center">
        <Grid item>
          <IconButton onClick={onPrevPage}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={onNextPage}>
            <NavigateNextIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
