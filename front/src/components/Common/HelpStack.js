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

export function HelpStack(props) {
  const {wide, children} = props;
  return (
    <React.Fragment>
      {!wide &&
        <Stack spacing={1}>
          {React.Children.map(children, child => (
            <Item >{child}</Item>
          ))}
        </Stack>
      }
      {wide &&
        <React.Fragment>
          {React.Children.map(children, child => (
            <Typography>- {child}</Typography>
          ))}
        </React.Fragment>
      }
    </React.Fragment>
  );
}
