import React from "react";
import "./MinersStatsList.css";
import { format } from "d3-format";
import { HashLink } from "react-router-hash-link";

const clone = require("rfdc")();

export function MinersStatsList(props) {
  const { minersStatsList } = props;

  const msList = clone(minersStatsList);

  msList.sort((msA, msB) => msB.nbm - msA.nbm);

  return (
    <div>
      <h2>
        Accumulated block reward lost because of ignored transactions per miner
        name
      </h2>
      <table className="divExpAccumRewardLost">
        <tbody>
          <tr>
            <td>Reward is compared against our mempool and algorithms.</td>
          </tr>
          <tr>
            <td>
              <b>Do not</b> interpret this result to compare how good a mining
              pool is selecting its transactions.
            </td>
          </tr>
          <tr>
            <td> Negative lost reward means better reward than us.</td>
          </tr>
          <tr>
            <td> Reward units are satoshis.</td>
          </tr>
          <tr>
            <td>
              Details can be found{" "}
              <HashLink smooth to="/faq#miners">
                here
              </HashLink>{" "}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="minersStatsTable">
        <thead>
          <tr>
            <th>Miner name</th>
            <th>
              <div># mined</div> blocks
            </th>
            <th>
              <div>Total lost reward</div> (getBlockTemplate)
            </th>
            <th>
              <div>Total lost reward</div> (onBlockArrival)
            </th>
            <th>
              <div>Avg. lost reward per block </div>(getBlockTemplate)
            </th>
            <th>
              <div>Avg. lost reward</div> per block (onBlockArrival)
            </th>
          </tr>
        </thead>
        <tbody>
          {msList.map((ms) => (
            <tr key={ms.mn}>
              <td>{linkTo(ms.mn)}</td>
              <td>{format(",")(ms.nbm)}</td>
              <td>{format(",")(ms.tlrBT)}</td>
              <td>{format(",")(ms.tlrCB)}</td>
              <td>{format(",")(ms.tlrBTpb)}</td>
              <td>{format(",")(ms.tlrCBpb)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function linkTo(minerName) {
  if (minerName === "global_miner_name") {
    return <HashLink to="/block/BITCOIND">All</HashLink>;
  } else {
    return <HashLink to={"/miner/" + minerName}>{minerName}</HashLink>;
  }
}

/*
    @JsonProperty("mn")
    private String minerName;
    @JsonProperty("nbm")
    private Integer numBlocksMined;
    @JsonProperty("tlrBT")
    private Long totalLostRewardBT;
    @JsonProperty("tlrCB")
    private Long totalLostRewardCB;
    @JsonProperty("tlrBTpb")
    private Long totalLostRewardBTPerBlock;
    @JsonProperty("tlrCBpb")
    private Long totalLostRewardCBPerBlock;

*/
