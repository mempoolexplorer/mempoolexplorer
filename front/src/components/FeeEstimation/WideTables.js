import React from "react";
import {TableFees} from "./TableFees";
import Grid from "@mui/material/Grid"

export function WideTables (props){
  const {fees} = props;
  return (
    <Grid container justifyContent="center" spacing={4}>
      <Grid item>
        <TableFees feeList={fees.csfl} estimationType="Conservative" header={true} />
      </Grid>
      <Grid item>
        <TableFees feeList={fees.nsfl} estimationType="Normal" header={true} />
      </Grid>
      <Grid item>
        <TableFees feeList={fees.esfl} estimationType="Economic" header={true} />
      </Grid>
    </Grid>
  );
}
