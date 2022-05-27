import React, {useState} from "react";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Snackbar from '@mui/material/Snackbar';

export function ScaleCheckers(props) {
  function stateFrom(by) {
    if (by === "byBoth") return {left: true, right: true};
    if (by === "byLeft") return {left: true, right: false};
    if (by === "byRight") return {left: false, right: true};
    return {left: true, right: true};
  }
  const [checks, setChecks] = useState(stateFrom(props.by));
  const [open, setOpen] = useState(false);

  function byFrom(left, right) {
    if (left && right) {
      return "byBoth";
    }
    if (left) return "byLeft";
    if (right) return "byRight";
    return "byBoth";
  }

  function onChangedLeft(event) {
    if (!event.target.checked && !checks.right) setOpen(true);
    const left =
      event.target.checked || (!event.target.checked && !checks.right);
    setChecks({left: left, right: checks.right});
    props.onChange(byFrom(left, checks.right));
  }

  function onChangedRight(event) {
    if (!event.target.checked && !checks.left) setOpen(true);
    const right =
      event.target.checked || (!event.target.checked && !checks.left);
    setChecks({left: checks.left, right: right});
    props.onChange(byFrom(checks.left, right));
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
          <Typography variant="body1" sx={{mr: 2}}>{props.label}</Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" justifyContent="center" direction="row">
            <Grid item>
              <FormGroup>
                <FormControlLabel control={
                  <Switch
                    checked={checks.left}
                    onChange={onChangedLeft}
                  />} label={props.leftText} />
              </FormGroup>
            </Grid>
            <Grid item>
              <FormGroup>
                <FormControlLabel control={
                  <Switch
                    checked={checks.right}
                    onChange={onChangedRight}
                  />} label={props.rightText} />
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={4000}
        message="Scale by Weight, Num Txs or Both but not by None"
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      />
    </>
  );
}
