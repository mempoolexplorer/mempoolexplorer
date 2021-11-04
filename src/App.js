import React from "react";
import "./App.css";
import { MempoolGraph } from "./components/MempoolGraph/MempoolGraph";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { MinerStats } from "./components/MinerStats/MinerStats";
import { BlockStats } from "./components/BlockStats/BlockStats";
import { IgTransactionList } from "./components/IgTransactionList/IgTransactionList";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/mempool">Mempool</Link> <span>| </span>
          <Link to="/igTx">Ignored Txs</Link> <span>| </span>
          <Link to="/block">Ignoring Blocks</Link> <span>| </span>
          <Link to="/miner">Miners</Link>
        </nav>

        <Switch>
          <Route path="/miner/:id">
            <MinerStats />
          </Route>
          <Route path="/miner">
            <MinerStats />
          </Route>
          <Route path="/block/:id">
            <BlockStats />
          </Route>
          <Route path="/block">
            <BlockStats />
          </Route>
          <Route path="/igTx">
            <IgTransactionList />
          </Route>
          <Route path="/mempool/:txId">
            <MempoolGraph />
          </Route>
          <Route path="/mempool">
            <MempoolGraph />
          </Route>
          <Route path="/">
            <MempoolGraph />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
