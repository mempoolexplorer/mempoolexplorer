import React from "react";
import { format } from "d3-format";
import { getNumberWithOrdinal } from "../../../utils/utils";
import { useWindowSize } from "../../../hooks/windowSize";
import { intervalToDuration, formatDuration } from "date-fns";
import { Link } from "react-router-dom";

import "./IgnoringBlocksTable.css";

export function IgnoringBlocksTable(props) {
  const data = props.igData;
  const node = props.nodeData;

  const size = useWindowSize();

  if (data === undefined || data === null) return null;
  if (data.ignoringBlocks === undefined || data.ignoringBlocks === null)
    return null;

  const layout = createLayout(size);

  return (
    <div
      className="ignoringBlocks"
      style={{
        width: layout.divSize.X + "px",
        overflowX: "scroll",
      }}
    >
      {data.ignoringBlocks.length === 0 && (
        <p>Transaction has not been ignored by miners.</p>
      )}
      {data.ignoringBlocks.length !== 0 && (
        <div>
          <p>Transaction has been ignored by miners.</p>
          <div>
            <table className="ignoringBlocksTableStats">
              <thead>
                <tr>
                  <th># Times ignored</th>
                  <th>Transaction Time</th>
                  <th className="CellWithComment">
                    Total Satoshi/Byte Lost:
                    <span className="CellComment">
                      Sum of (Tx.satByte-blockMinSatBytes) for each ignoring
                      block
                    </span>
                  </th>
                  <th className="CellWithComment">
                    Total Fees Lost:
                    <span className="CellComment">
                      TotalSatvBytesLost*tx.vSize
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{format(",")(data.ignoringBlocks.length)}</td>
                  <td>{new Date(node.t).toISOString()}</td>
                  <td>{format(".6f")(data.totalSVByteLost)}</td>
                  <td>{format(",")(data.totalFeesLost)}</td>
                </tr>
              </tbody>
            </table>
            <br></br>
            <table className="ignoringBlocksTable">
              <tbody>
                <tr>
                  <td>Block#</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "height"}>
                      <Link to={"/block/" + ib.height}>{ib.height}</Link>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>#Txs in mined block</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "txsInMinedBlock"}>
                      {ib.txsInMinedBlock}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>#Txs in candidate block</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "txsInCandidateBlock"}>
                      {ib.txsInCandidateBlock}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Position in candidate block</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "posInCandidateBlock"}>
                      {getNumberWithOrdinal(ib.posInCandidateBlock + 1)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Block Time</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "BlockTime"}>
                      {new Date(ib.time).toISOString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Delta Time</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td key={ib.height + "DeltaTime"}>
                      {getDeltaStr(node.t, ib.time)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Miner Name</td>
                  {data.ignoringBlocks.map((ib) => (
                    <td
                      className="CellWithComment"
                      key={ib.height + "minerName"}
                    >
                      <Link to={"/miner/" + ib.coinBaseData.minerName}>
                        {ib.coinBaseData.minerName}
                      </Link>
                      <span className="CellComment">
                        coinbase field ascii: {ib.coinBaseData.ascciOfField}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function createLayout(size) {
  const margins = { horizontal: 100, vertical: 0 };

  const sizes = {
    divSize: { X: size.width - margins.horizontal },
  };

  const layout = { ...margins, ...sizes };
  return layout;
}
function getDeltaStr(txTime, iBlockTime) {
  const duration = intervalToDuration({
    start: new Date(txTime),
    end: new Date(iBlockTime),
  });
  return formatDuration(duration);
}
