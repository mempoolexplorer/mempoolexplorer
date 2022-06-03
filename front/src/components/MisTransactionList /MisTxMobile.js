import React, {useState} from "react";
import TableCell from "@mui/material/TableCell";
import {HashLink} from "react-router-hash-link";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {getAlgoName} from "../Common/AlgoTabs";
import {Collapse, Typography} from "@mui/material";
import {MisInnerTablesMobile} from "./MisInnerTablesMobile";
import {useTheme} from '@mui/material/styles';
import {Styled4n1TableRow} from "../../utils/CommonComponents";

export function MisTxMobile(props) {
  const {mTx, algo} = props;
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <React.Fragment>
      <Styled4n1TableRow>
        <TableCell colSpan="3">
          <Typography>Transaction Id:</Typography>
          {mTx.txId}
        </TableCell>
      </Styled4n1TableRow>
      <Styled4n1TableRow>
        <TableCell rowSpan="2">
          <IconButton
            aria-label="expand row"
            size="big"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell><Typography variant="body2" color={theme.palette.text.secondary}>#Times Ignored</Typography></TableCell>
        <TableCell sx={{textAlign: "end"}}><Typography variant="body2" color={theme.palette.text.secondary}>State</Typography></TableCell>
      </Styled4n1TableRow>
      <Styled4n1TableRow>
        <TableCell>{mTx.ignoringBlocks.length}</TableCell>
        <TableCell sx={{minWidth: {md: 150}, textAlign: "end"}}>
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
      </Styled4n1TableRow>
      <Styled4n1TableRow>
        <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={4}>
          <Collapse in={visible} timeout="auto" unmountOnExit>
            <MisInnerTablesMobile mTx={mTx} algo={algo} />
          </Collapse>
        </TableCell>
      </Styled4n1TableRow>
    </React.Fragment >);
}
