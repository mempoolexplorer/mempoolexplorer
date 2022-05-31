import React from "react";
import {MempoolGraph} from "./components/MempoolGraph/MempoolGraph";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {MinerStats} from "./components/MinerStats/MinerStats";
import {BlockStats} from "./components/BlockStats/BlockStats";
import {BlocksStats} from "./components/BlocksStats/BlocksStats";
import {IgTransactionList} from "./components/IgTransactionList/IgTransactionList";
import {MisTransactionList} from "./components/MisTransactionList /MisTransactionList";
import {TxsGraphsList} from "./components/TxsGraphsList/TxsGraphsList";
import {FeeEstimation} from "./components/FeeEstimation/FeeEstimation";
import {Faq} from "./components/Faq/Faq";
import {Footer} from "./components/Common/Footer";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const drawerWidth = 200;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [title, setTitle] = React.useState("Bitcoin Mempool");

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        <Divider />
        <ListItemButton key="mempool" component={Link} to="/mempool">
          <ListItemText primary="Mempool" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="feeEstimation" component={Link} to="/feeEstimation" >
          <ListItemText primary="Fee Estimation" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="txsGraphs" component={Link} to="/txsGraphs">
          <ListItemText primary="Transactions Graphs" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="ignoredTxs" component={Link} to="/igTx">
          <ListItemText primary="Ignored Transactions" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="missingTxs" component={Link} to="/misTx">
          <ListItemText primary="Missing Transactions" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="ignoringBlocks" component={Link} to="/blocks/BITCOIND">
          <ListItemText primary="Ignoring Blocks" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="miners" component={Link} to="/miner">
          <ListItemText primary="Miners Statistics" />
        </ListItemButton>
        <Divider />
        <ListItemButton key="faq" component={Link} to="/faq">
          <ListItemText primary="FAQ" />
        </ListItemButton>
        <Divider />
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Router>
        <Box sx={{display: 'flex'}}>
          <AppBar
            position="fixed"
            sx={{
              width: {lg: `calc(100% - ${drawerWidth}px)`},
              ml: {lg: `${drawerWidth}px`},
            }}
          >
            <Toolbar variant="dense">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{mr: 2, display: {lg: 'none'}}}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{width: {lg: drawerWidth}, flexShrink: {lg: 0}}}
            aria-label="Navigation menu"
          >
            {isMobile && <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
              }}
            >
              {drawer}
            </Drawer>}
            {!isMobile && <Drawer
              variant="permanent"
              sx={{
                '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
              }}
              open
            >
              {drawer}
            </Drawer>}
          </Box>
          <Box
            component="main"
            sx={{flexGrow: 1, pl: 3, pr: 3, width: {lg: `calc(100% - ${drawerWidth}px)`}}}
          >
            <Toolbar />
            <Box>
              <Box>
                <Switch>
                  <Route path="/miner/:id">
                    <MinerStats setTitle={setTitle} />
                  </Route>
                  <Route path="/miner">
                    <MinerStats setTitle={setTitle} />
                  </Route>
                  <Route path="/block/:idParam/:algop">
                    <BlockStats setTitle={setTitle} />
                  </Route>
                  <Route path="/blocks/:algop">
                    <BlocksStats setTitle={setTitle} />
                  </Route>
                  <Route path="/igTx">
                    <IgTransactionList setTitle={setTitle} />
                  </Route>
                  <Route path="/misTx">
                    <MisTransactionList setTitle={setTitle} />
                  </Route>
                  <Route path="/txsGraphs/:index">
                    <TxsGraphsList setTitle={setTitle} />
                  </Route>
                  <Route path="/txsGraphs">
                    <TxsGraphsList setTitle={setTitle} />
                  </Route>
                  <Route path="/mempool/:txId">
                      <MempoolGraph setTitle={setTitle} />
                  </Route>
                  <Route path="/feeEstimation">
                    <FeeEstimation setTitle={setTitle} />
                  </Route>
                  <Route path="/mempool">
                      <MempoolGraph setTitle={setTitle} />
                  </Route>
                  <Route path="/faq">
                    <Faq setTitle={setTitle} />
                  </Route>
                  <Route path="/">
                      <MempoolGraph setTitle={setTitle} />
                  </Route>
                </Switch>
              </Box>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
