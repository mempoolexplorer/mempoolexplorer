import React from "react";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';

export function Footer() {
  return (
    <Grid container justifyContent="center" columnSpacing={10}>
      <Grid item >
        <Grid container direction="column" justifyContent="center" columnSpacing={4} >
          <Grid item>
            <Grid container justifyContent="center" spacing={4} >
              <Grid item >
                <Tooltip title="Project" placement="top">
                  <IconButton href="https://github.com/mempoolexplorer/mempoolexplorer">
                    <GitHubIcon sx={{fontSize: 40}} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item >
                <Tooltip title="Me" placement="top">
                  <IconButton href="https://github.com/dev7ba">
                    <GitHubIcon sx={{fontSize: 40}} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography textAlign="center">Code and self hosting instructions</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item >
        <Grid container direction="column" justifyContent="center" columnSpacing={4} >
          <Grid item>
            <Grid container justifyContent="center" spacing={4} >
              <Grid item>
                <IconButton href="https://twitter.com/dev7ba">
                  <TwitterIcon sx={{fontSize: 40}} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton href="mailto:dev7ba.protonmail.com">
                  <EmailIcon sx={{fontSize: 40}} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography textAlign="center">Contact</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
