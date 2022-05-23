import React, {useState, useEffect} from "react";
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {SecondaryTypo} from "../../../utils/CommonComponents"
import {intervalToDuration, formatDuration} from "date-fns";
import Tooltip from '@mui/material/Tooltip';

export function ForceGraphHeader(props) {
  const {data, interactive, setInteractive, lockMempool, setLockMempool} = props;
  const lastUpdate = data.lastModTime;
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => updateDataByTimer(), 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  function updateDataByTimer() {
    setDate(new Date());
  }

  function onChangedInteractive(event) {
    const checked = event.target.checked;
    setInteractive(checked);
    if (checked) {
      setLockMempool(true);
    }
    if (!checked && lockMempool) {
      setOpen(true);
    }
  }

  function onChangedLock(event) {
    const checked = event.target.checked;
    setLockMempool(checked);
  }

  function duration(millis) {
    const txDuration = intervalToDuration({
      start: new Date(millis),
      end: date,
    });
    return formatDuration(txDuration);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="center" direction="row">
        <Grid item>
          <FormGroup>
            <Tooltip arrow title={
              <Box>
                <Typography variant="h8" component="p">Allows pick and move nodes for better visualization.</Typography>
                <Typography variant="h8" component="p">In this case it's better to lock the mempool.</Typography>
              </Box>
            } >
              <FormControlLabel control={
                <Switch
                  checked={interactive}
                  onChange={onChangedInteractive}
                />} label="Interactive Mode" />
            </Tooltip >
          </FormGroup>
        </Grid>
        {interactive &&
          <>
            <Grid item>
              <FormGroup>
                <Tooltip title="Stops refreshing the mempool view" arrow>
                  <FormControlLabel control={
                    <Switch
                      checked={lockMempool}
                      onChange={onChangedLock}
                    />} label="Lock Mempoool" />
                </Tooltip>
              </FormGroup>
            </Grid>
            <Grid item>
              <SecondaryTypo sx={{mt: {xs: 1, sm: 0}, }}> Last Update: {duration(lastUpdate)}</SecondaryTypo>
            </Grid>
          </>
        }
      </Grid>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={2000}
        message="Mempool is still locked"
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />
    </>
  );
}
