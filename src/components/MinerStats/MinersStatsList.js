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
          <th>Miner name</th>
          <th>
            <div># mined</div> blocks
          </th>
          <th>
            <div>Total lost reward</div> (getBlockTemplate)
          </th>
          <th>
            <div>Total lost reward</div> (ideal)
          </th>
          <th>
            <div>Avg. lost reward per block </div>(getBlockTemplate)
          </th>
          <th>
            <div>Avg. lost reward</div> per block (ideal)
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
  );
}

function linkTo(minerName) {
  if (minerName === "global_miner_name") {
    return <Link to="/block/BITCOIND">All</Link>;
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
