import Box from '@mui/material/Box'
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {styled} from '@mui/material/styles';
import {Typography} from "@mui/material";
import {useWindowSize} from "../../hooks/windowSize";
import {scaleLinear} from "d3-scale";
import {stringTruncateFromCenter} from "../../utils/utils";

export function TxsGraphTxList(props) {
  const {txSet, id} = props;
  const size = useWindowSize();

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  function calculatePercent() {
    let per = scaleLinear().domain([200, 570]).range([0, 1]).clamp(true);
    return per(size.width);
  }

  return (
    <Box>
      <Typography variant="h5">Transactions in {txSet.nonLinear ? "non linear" : "linear"} graph # {id}:</Typography>
      <Stack spacing={1} sx={{mt: 2}}>
        {txSet.txSet.map((txId) => (
          <Item key={txId}>
            {/* <StyledHL */}
            <Link component={HashLink} smooth to={"/mempool/" + txId + "#txsDependencyGraph"}>
              {stringTruncateFromCenter(txId, calculatePercent())}
              {/* </StyledHL > */}
            </Link>
          </Item>
        ))}
      </Stack>
    </Box >
  );
}
