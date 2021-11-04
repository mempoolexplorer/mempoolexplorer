import React from "react";
import "./MinersStatsList.css";
import { format } from "d3-format";
import { Link } from "react-router-dom";

const clone = require("rfdc")();

export function MinersStatsList(props) {
  const { minersStatsList } = props;

  const msList = clone(minersStatsList);

  msList.sort((msA, msB) => msB.nbm - msA.nbm);

  return (
    <table className="minersStatsTable">
      <thead>
        <tr>
          <td>Miner name</td>
          <td># mined blocks</td>
          <td>Total lost reward (bitcoind)</td>
          <td>Total lost reward (ours)</td>
          <td>Avg. lost reward per block (bitcoind)</td>
          <td>Avg. lost reward per block (ours)</td>
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
  );
}

function linkTo(minerName) {
  if (minerName === "global_miner_name") {
    return <Link to="/block">All</Link>;
  } else {
    return <Link to={"/miner/" + minerName}>{minerName}</Link>;
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
