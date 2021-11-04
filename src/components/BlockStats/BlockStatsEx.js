import React from "react";
import { format } from "d3-format";
import "./BlockStatsEx.css";

function formatMinusOne(value, ret) {
  if (value === -1) {
    return ret;
  }
  return format(",")(value);
}

function formatSatVByte(fees, weight) {
  if (fees === -1) return "-";
  if (weight === -1) return "-";
  return format("6f")(fees / (weight / 4));
}

export function BlockStatsEx(props) {
  const { igBlockEx } = props;
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
            <th>In Mempool</th>
            <th>In Mined Block</th>
            <th>In Candidate Block</th>
            <th>Meaning</th>
            <th colSpan="2">Statistics</th>
          </tr>
          <tr>
            <td rowSpan="32" className="vertText">
              <span>Transactions when mined block arrived</span>
            </td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">-</td>
            <td rowSpan="4">-</td>
            <td rowSpan="4">In our Mempool</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">
              {formatMinusOne(igBlockEx.mempool.num, 0)}
            </td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight:</td>
            <td className="stripped">
              {formatMinusOne(igBlockEx.mempool.weight, "-")}
            </td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees:</td>
            <td className="stripped">
              {formatMinusOne(igBlockEx.mempool.fees, "-")}
            </td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(igBlockEx.mempool.fees, igBlockEx.mempool.weight)}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">-</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">-</td>
            <td rowSpan="4">In Mined Block</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.minedBlock.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.minedBlock.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.minedBlock.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td>
              {formatSatVByte(
                igBlockEx.minedBlock.fees,
                igBlockEx.minedBlock.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">-</td>
            <td rowSpan="4">-</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">In candidate block</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.candidateBlock.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.candidateBlock.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.candidateBlock.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.candidateBlock.fees,
                igBlockEx.candidateBlock.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">In common</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.inCommon.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.inCommon.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.inCommon.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.inCommon.fees,
                igBlockEx.inCommon.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">No</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">Ignored by miner</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredONRByMiner.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredONRByMiner.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredONRByMiner.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.ignoredONRByMiner.fees,
                igBlockEx.ignoredONRByMiner.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">No</td>
            <td rowSpan="4">Ignored By Us</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredByUs.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredByUs.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.ignoredByUs.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.ignoredByUs.fees,
                igBlockEx.ignoredByUs.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">-</td>
            <td rowSpan="4">Relayed to us</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.relayedToUs.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.relayedToUs.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.relayedToUs.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.relayedToUs.fees,
                igBlockEx.relayedToUs.weight
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan="4">No</td>
            <td rowSpan="4">Yes</td>
            <td rowSpan="4">No</td>
            <td rowSpan="4">Not relayed to us</td>
            <td className="stripped"># Txs:</td>
            <td className="stripped">{formatMinusOne(igBlockEx.notRelayedToUs.num, 0)}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Weight</td>
            <td className="stripped">{formatMinusOne(igBlockEx.notRelayedToUs.weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped"><>&sum;</> Fees</td>
            <td className="stripped">{formatMinusOne(igBlockEx.notRelayedToUs.fees, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">
              {formatSatVByte(
                igBlockEx.notRelayedToUs.fees,
                igBlockEx.notRelayedToUs.weight
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
