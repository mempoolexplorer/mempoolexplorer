import React, {useState} from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {getAlgoName} from "../Common/AlgoTabs";
import {Collapse} from "@mui/material";
import {MisInnerTables} from "./MisInnerTables";
import {useTheme} from '@mui/material/styles';
import {useWindowSize} from "../../hooks/windowSize";
import {scaleLinear} from "d3-scale";
import {stringTruncateFromCenter} from "../../utils/utils";

export function MisTx(props) {
  const {mTx, algo,btcusd, viewAll} = props;
  const [visible, setVisible] = useState(viewAll);
  const theme = useTheme();
  const size = useWindowSize();

  function calculatePercent() {
    let per = scaleLinear().domain([350, 900]).range([0, 1]).clamp(true);
    return per(size.width);
  }

  return (
    <React.Fragment>
      <TableRow sx={!viewAll ? {
        '&:nth-of-type(4n+1)': {backgroundColor: theme.palette.action.disabledBackground},
        '&:last-child td, &:last-child th': {border: 0}
      } : {}}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{mTx.ignoringBlocks.length}</TableCell>
        <TableCell sx={{minWidth: {md: 150}}}>
          {mTx.state === "INMEMPOOL" && (
            <Link component={HashLink} smooth to={"/mempool/" + mTx.txId + "#ignoringTxsSection"}>
              In mempool
            </Link>
          )}
          {mTx.state === "MINED" && (
            <Box>
              In Block:{" "}
              <Link component={HashLink} smooth to={"block/" + mTx.finallyMinedOnBlock + "/" + getAlgoName(algo)}>
                {mTx.finallyMinedOnBlock}
              </Link>
            </Box>
          )}
          {mTx.state === "DELETED" && <Box>Deleted</Box>}
          {mTx.state === "ERROR" && <Box>Error</Box>}
        </TableCell>
        <TableCell>
          {stringTruncateFromCenter(mTx.txId, calculatePercent())}
        </TableCell>
      </TableRow >
      <TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
          <Collapse in={visible} timeout="auto" unmountOnExit>
            <MisInnerTables mTx={mTx} algo={algo} btcusd={btcusd} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment >);
}
