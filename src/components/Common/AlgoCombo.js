import React from "react";
import "./AlgoCombo.css";

export function AlgoCombo(props) {
  const { onChange, algo } = props;

  return (
    <div className="txSelAlgo">
      <label>Transaction selection algorithm: </label>
      <select name="algo" id="algorithms" onChange={onChange} value={algo}>
        <option value="BITCOIND">getBlockTemplate</option>
        <option value="OURS">onBlockArrival</option>
      </select>
    </div>
  );
}
