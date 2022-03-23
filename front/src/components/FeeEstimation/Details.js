import React from "react";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export function Details(props) {
  const {wide} = props;
  return (
    <React.Fragment>
      {!wide &&
        <Stack spacing={1}>
          <Item>- This is the output of calling RPC <code>estimatesmartfee</code> in our code. </Item>
          <Item>- Non valid estimations as declared in RPC <code>estimatesmartfee</code> help are not shown.</Item>
          <Item>- Results in satoshis per VByte are rounded to the nearest integer between parenthesis.</Item>
        </Stack>
      }
      {wide &&
        <React.Fragment>
          <Typography>- This is the output of calling RPC <code>estimatesmartfee</code> in our code. </Typography>
          <Typography>- Non valid estimations as declared in RPC <code>estimatesmartfee</code> help are not shown.</Typography>
          <Typography>- Results in satoshis per VByte are rounded to the nearest integer between parenthesis.</Typography>
        </React.Fragment>
      }
    </React.Fragment>
  );
}
