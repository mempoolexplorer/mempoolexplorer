import React, { useState } from "react";
import { format } from "d3-format";

import { BlockStatsExElement } from "./BlockStatsExElement";
import "./BlockStatsEx.css";

export function BlockStatsEx(props) {
  const { igBlockEx } = props;

  const [viewAll, setViewAll] = useState(false);

  function onAllShow() {
    setViewAll(!viewAll);
  }

  function keyFor(panel, meaning) {
    return viewAll + meaning + panel.num + panel.weight + panel.fees;
  }

  return (
    <div>
      <table className="blockStatsEx">
        <thead>
          <tr>
            <th>Height</th>
            <th>Miner name</th>
            <th>Lost reward</th>
            <th>Lost reward excluding not in mempool txs</th>
            <th>Block date:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{igBlockEx.h}</td>
            <td>{igBlockEx.mn}</td>
            <td>{format(",")(igBlockEx.lr)}</td>
            <td>{format(",")(igBlockEx.lreNIM)}</td>
            <td>{new Date(igBlockEx.t).toISOString()}</td>
          </tr>
        </tbody>
      </table>

      <table className="blockStatsExSets">
        <tbody>
          <tr>
            <th className="noBorder"></th>
            <th>In mempool</th>
            <th>In mined block</th>
            <th>
              <div>In our candidate</div> <div>block</div>
            </th>
            <th>Meaning</th>
            <th colSpan="3">
              <span>Statistics</span>
              <div>
                <button onClick={onAllShow}>
                  {viewAll === false && <div>+</div>}
                  {viewAll === true && <div>-</div>}
                </button>
              </div>
            </th>
          </tr>

          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.mempool, "iom")}
            lateralMsg="Transactions when mined block arrived"
            inMempool="Yes"
            inMinedBlock="-"
            inCandidateBlock="-"
            meaning="In our mempool"
            numTxs={igBlockEx.mempool.num}
            weight={igBlockEx.mempool.weight}
            fees={igBlockEx.mempool.fees}
          />

          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.minedBlock, "imb")}
            lateralMsg=""
            inMempool="-"
            inMinedBlock="Yes"
            inCandidateBlock="-"
            meaning="In mined block"
            numTxs={igBlockEx.minedBlock.num}
            weight={igBlockEx.minedBlock.weight}
            fees={igBlockEx.minedBlock.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.candidateBlock, "icb")}
            lateralMsg=""
            inMempool="-"
            inMinedBlock="-"
            inCandidateBlock="Yes"
            meaning="In our candidate block"
            numTxs={igBlockEx.candidateBlock.num}
            weight={igBlockEx.candidateBlock.weight}
            fees={igBlockEx.candidateBlock.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.inCommon, "ic")}
            lateralMsg=""
            inMempool="Yes"
            inMinedBlock="Yes"
            inCandidateBlock="Yes"
            meaning="In common"
            numTxs={igBlockEx.inCommon.num}
            weight={igBlockEx.inCommon.weight}
            fees={igBlockEx.inCommon.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.ignoredONRByMiner, "ibm")}
            lateralMsg=""
            inMempool="Yes"
            inMinedBlock="No"
            inCandidateBlock="Yes"
            meaning="Ignored by miner"
            numTxs={igBlockEx.ignoredONRByMiner.num}
            weight={igBlockEx.ignoredONRByMiner.weight}
            fees={igBlockEx.ignoredONRByMiner.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.ignoredByUs, "ibu")}
            lateralMsg=""
            inMempool="Yes"
            inMinedBlock="Yes"
            inCandidateBlock="No"
            meaning="Ignored by us"
            numTxs={igBlockEx.ignoredByUs.num}
            weight={igBlockEx.ignoredByUs.weight}
            fees={igBlockEx.ignoredByUs.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.relayedToUs, "rtu")}
            lateralMsg=""
            inMempool="Yes"
            inMinedBlock="Yes"
            inCandidateBlock="-"
            meaning="Relayed to us"
            numTxs={igBlockEx.relayedToUs.num}
            weight={igBlockEx.relayedToUs.weight}
            fees={igBlockEx.relayedToUs.fees}
          />
          <BlockStatsExElement
            expanded={viewAll}
            key={keyFor(igBlockEx.notRelayedToUs, "nrtu")}
            lateralMsg=""
            inMempool="No"
            inMinedBlock="Yes"
            inCandidateBlock="No"
            meaning="Not relayed to us"
            numTxs={igBlockEx.notRelayedToUs.num}
            weight={igBlockEx.notRelayedToUs.weight}
            fees={igBlockEx.notRelayedToUs.fees}
          />
        </tbody>
      </table>
    </div>
  );
}
