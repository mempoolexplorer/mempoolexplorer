import React from "react";
import {HashLink} from "react-router-hash-link";
import "./Explanation.css";

export function Explanation(props) {
  const width = props.width;
  return (
    <div
      style={{
        width: width + "px",
        textAlign: "left",
        margin: "10px 40px"
      }
      }
    >
      <h3>Where is my transaction?</h3>
      When you send a bitcoin transaction to the network, it's queued in the mempool waiting to be mined. This graph shows mempool data from my node.
      < p />
      Transactions pays a fee in satoshis to be mined and has a size measured in vBytes.
      Miners order transactions to obtain the best profit by using the value fee/vBytes. The smaller and more generous with the miners the transaction is, the faster is mined.
      < p />
      Transactions are arranged within blocks of, at most, 4MWU (Mega Weight Units) that are mined each 10 minutes in average.
      Blocks waiting to be mined are represented in the graph stacked and scaled by weight, number of transactions or both.
      They are colored from red to green depending on the fee/vByte ratio.
      < p />
      By clicking in one of these blocks, another graph is shown with the contents of that block ordered by sets containing the transactions paying the same fee/vByte to miners
      (rounded to integer and <HashLink to="/faq#cpfp">CPFP </HashLink>aware).
      < p />
      Again, by clicking in one of these sets, another graph is shown with all the transactions in that set.
      Finally, if a transaction is clicked in the third graph, information about dependencies, whether has been ignored by miners, input & outputs and other details are shown.
      < p />
      The small graph at the bottom left shows how much transaction weight has arrived in the last 10 minutes (average block time).
      Above 4MWU/10 minutes the mempool is, in average, filling, and below that value, is emptying.
    </div >
  );
}
