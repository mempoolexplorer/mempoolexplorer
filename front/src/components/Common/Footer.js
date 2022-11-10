import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
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
      <Grid item >
        <Grid container direction="column" justifyContent="center" columnSpacing={4} >
          <Grid item>
            <Grid container justifyContent="center" spacing={4} >
              <Grid item >
                <Tooltip title="Samourai wallet" placement="top">
                  <IconButton href="https://paynym.is/+silentbar716">
                    <Box
                      component="img"
                      sx={{
                        height: 45,
                        width: 45,
                      }}
                      alt="Samourai wallet logo"
                      src="/samourai-footer-logo.png"
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item >
                <Tooltip title="BtcPay Server" placement="top">
                  <form method="POST" action="https://pagosinreglas.ddns.net/api/v1/invoices" className="btcpay-form btcpay-form--block">
                    <input type="hidden" name="storeId" value="9xMRWCtFdhuRQ9iLFdiLw8Yg6iyCB4S1AYWQVYHn3Kt7" />
                    <input type="hidden" name="checkoutDesc" value="Thanks for your donation" />
                    <input type="hidden" name="notifyEmail" value="anonbuy1@protonmail.com" />
                    <input type="hidden" name="currency" value="EUR" />
                    {/* <input type="image" class="submit" name="submit" src="https://pagosinreglas.ddns.net/img/paybutton/pay.svg" alt="Pay with BTCPay Server, a Self-Hosted Bitcoin Payment Processor" /> */}
                    <IconButton type="submit">
                      <Box
                        component="img"
                        sx={{
                          height: 45,
                          width: 45,
                        }}
                        alt="BtcPay server Logo"
                        src="/btcpay-logo.webp"
                      // src="https://aceptandobitcoin.com/wp-content/uploads/2021/12/btcpay-1.jpg"
                      />
                    </IconButton >
                  </form>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography textAlign="center">Donate</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
