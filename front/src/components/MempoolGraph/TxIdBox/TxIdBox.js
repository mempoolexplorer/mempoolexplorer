import React from "react";
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import {UpdateBox} from "../UpdateBox/UpdateBox";

export function TxIdBox(props) {
  return (
    <>
      <Grid container alignItems="center" justifyContent="center" direction="row">
        <Grid item >
          <Box></Box>
        </Grid>
        <Grid item >
          <Grid container alignItems="center" justifyContent="center" direction="row">
            <TextField label="TxId:" size="small"
              sx={{width: {sm: 300, md: 650}}}
              placeholder="Insert a TxId or choose one by CLICKING the mempool..."
              value={props.txIdTextState}
              onChange={props.onTxIdTextChanged}
              onKeyPress={props.onTxInputKeyPress}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <CurrencyBitcoinIcon />
                </InputAdornment>
              }}
            />
            <Tooltip title="Search" arrow>
              <IconButton onClick={props.onTxSearchButton} size="small"><SearchIcon></SearchIcon></IconButton>
            </Tooltip>
            <Typography>or</Typography>
            <Tooltip title="Find a fancy tx for me please" arrow>
              <IconButton onClick={props.onTxFancy} size="small"><SavedSearchIcon></SavedSearchIcon></IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item sx={{ml: {md: 8}}}>
            <UpdateBox
              lockMempool={props.lockMempool}
              setLockMempool={props.onSetLockMempool}
              lastUpdate={props.data.lastModTime}
            />
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="center" direction="row">
        <Grid item >
          {props.txIdNotFoundState && (
            <Typography variant="h3" sx={{m: 3}}>TxId not Found in mempool</Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
