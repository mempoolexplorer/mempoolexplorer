import React, {useState} from "react";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import {useWindowSize} from "../../../../hooks/windowSize";
import {Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import {CHashLink} from "../../../../utils/CommonComponents";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const PTypo = styled(Typography)(() => {
  return {
    marginTop: 10
  };
});

export function Explanation() {
  const [moreHelp, setMoreHelp] = useState(false);
  const wSize = useWindowSize();
  const theme = useTheme();
  const textFits = useMediaQuery(theme.breakpoints.up("1448"));
  const graphNotFit = useMediaQuery(theme.breakpoints.down("600px"));
  // const graphNotFit = useMediaQuery({query: '(max-width: 600px)'})
  const width = graphNotFit ? wSize.width - 20 : 600;

  return (
    <Grid item>
      <Box sx={{
        maxWidth: width + "px",
        textAlign: "left",
        margin: "10px 40px"
      }}>
        <Typography variant="h6" textAlign="left">Where is my transaction?</Typography>
        <PTypo>When you send a bitcoin transaction to the network, it's queued in the mempool waiting to be mined. This graph shows mempool data from my node.</PTypo>
        {!textFits &&
        <Grid container justifyContent="center" sx={{my:1}}>
            <IconButton
              aria-label="expand explanation"
              size="small"
              onClick={() => setMoreHelp(!moreHelp)}
            >
              {moreHelp ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Grid>
        }
        {(moreHelp || textFits) &&
          <>
            <PTypo>
              Transactions pays a fee in satoshis to be mined and has a size measured in vBytes.
              Miners order transactions to obtain the best profit by using the value fee/vBytes. The smaller and more generous with the miners the transaction is, the faster is mined.
            </PTypo>
            <PTypo>
              Transactions are arranged within blocks of, at most, 4MWU (Mega Weight Units) that are mined each 10 minutes in average.
              Blocks waiting to be mined are represented in the graph stacked and scaled by weight, number of transactions or both.
              They are colored from red to green depending on the fee/vByte ratio.
            </PTypo>
            <PTypo>
              By clicking in one of these blocks, another graph is shown with the contents of that block ordered by sets containing the transactions paying the same fee/vByte to miners
              (rounded to integer and <CHashLink to="/faq#cpfp">CPFP </CHashLink>aware).
            </PTypo>
            <PTypo>
              Again, by clicking in one of these sets, another graph is shown with all the transactions in that set.
              Finally, if a transaction is clicked in the third graph, information about dependencies, whether has been ignored by miners, input & outputs and other details are shown.
            </PTypo>
            <PTypo>
              The small graph at the bottom left shows how much transaction weight has arrived in the last 10 minutes (average block time).
              Above 4MWU/10 minutes the mempool is, in average, filling, and below that value, is emptying.
            </PTypo>
          </>
        }
      </Box>
    </Grid>
  );
}
