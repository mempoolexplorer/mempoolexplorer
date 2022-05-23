import React, {useState, useEffect} from "react";
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {intervalToDuration, formatDuration} from "date-fns";
import Tooltip from '@mui/material/Tooltip';
import {SecondaryTypo} from "../../../../utils/CommonComponents"

export function UpdateBox(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => updateDataByTimer(), 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  function updateDataByTimer() {
    setDate(new Date());
  }

  function onChangedLock(event) {
    const checked = event.target.checked;
    props.setLockMempool(checked);
  }

  function duration(millis) {
    const txDuration = intervalToDuration({
      start: new Date(millis),
      end: date,
    });
    return formatDuration(txDuration);
  }

  return (
    props.lastUpdate !== undefined && (
      <Grid container alignItems="center" justifyContent="center" direction="row">
        <Grid item>
          <FormGroup>
            <Tooltip title="Stops refreshing the mempool view" arrow>
              <FormControlLabel control={
                <Switch
                  checked={props.lockMempool}
                  onChange={onChangedLock}
                />} label="Lock Mempoool" />
            </Tooltip>
          </FormGroup>
          <SecondaryTypo> Last Update: {duration(props.lastUpdate)}</SecondaryTypo>
        </Grid>
      </Grid>
    )
  );
}
