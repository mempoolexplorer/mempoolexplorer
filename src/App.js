import React from "react";
import "./App.css";
import { MempoolGraph } from "./components/MempoolGraph/MempoolGraph";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MinerStats } from "./components/MinerStats/MinerStats";
import { BlockStats } from "./components/BlockStats/BlockStats";
import { IgTransactionList } from "./components/IgTransactionList/IgTransactionList";
import { MisTransactionList } from "./components/MisTransactionList /MisTransactionList";
import { TxsGraphsList } from "./components/TxsGraphsList/TxsGraphsList";
import { Faq } from "./components/Faq/Faq";

function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <nav>
            <Link to="/mempool">Mempool</Link> <span>| </span>
            <Link to="/txsGraphs">Txs Graphs</Link> <span>| </span>
            <Link to="/igTx">Ignored Txs</Link> <span>| </span>
            <Link to="/misTx">Missing Txs</Link> <span>| </span>
            <Link to="/block/BITCOIND">Ignoring Blocks</Link> <span>| </span>
            <Link to="/miner">Miners</Link> <span>| </span>
            <Link to="/faq">FAQ</Link>
          </nav>

          <Switch>
            <Route path="/miner/:id">
              <MinerStats />
            </Route>
            <Route path="/miner">
              <MinerStats />
            </Route>
            <Route path="/block/:id/:algop">
              <BlockStats />
            </Route>
            <Route path="/block/:algop">
              <BlockStats />
            </Route>
            <Route path="/igTx">
              <IgTransactionList />
            </Route>
            <Route path="/misTx">
              <MisTransactionList />
            </Route>
            <Route path="/txsGraphs">
              <TxsGraphsList />
            </Route>
            <Route path="/mempool/:txId">
              <MempoolGraph />
            </Route>
            <Route path="/mempool">
              <MempoolGraph />
            </Route>
            <Route path="/faq">
              <Faq />
            </Route>
            <Route path="/">
              <MempoolGraph />
            </Route>
          </Switch>
        </div>
      </Router>
      <footer>
        <a href="https://github.com/mempoolexplorer">Project's Github</a>{" "}
        <span>| </span>
        <a href="https://github.com/dev7ba">Github</a>
        <span>| </span>
        <a href="https://keybase.io/dev7ba">Keybase</a>
        <span>| </span>
        <a href="mailto:dev7ba.protonmail.com">Mail</a>
      </footer>
    </div>
  );
}

export default App;
