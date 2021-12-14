import React, { useState } from "react";
import { format } from "d3-format";
import { Link } from "react-router-dom";
import { useWindowSize } from "../../hooks/windowSize";
import { filteredGetNumberWithOrdinal } from "../../utils/utils";
import "./MisTransaction.css";

export function MisTransaction(props) {
  const { mTx, algo, vis } = props;
  const [visible, setVisible] = useState(vis);

  const size = useWindowSize();
  const layout = createLayout(size);

  function onShow() {
    setVisible(!visible);
  }

  function ignoringMiners(igBl) {
    const minerNamesSet = new Set();
    igBl.forEach((ig) => {
      minerNamesSet.add(ig.coinBaseData.minerName);
    });
    var a = [...minerNamesSet];
    if (minerNamesSet.size === 1) {
      return a[0];
    }
    return a.slice(0, -1).join(", ") + " and " + a.slice(-1);
  }

  return (
    <React.Fragment>
      <tr>
        <td>{mTx.ignoringBlocks.length}</td>
        <td>
          {mTx.state === "INMEMPOOL" && (
            <Link to={"/mempool/" + mTx.txId}>In mempool</Link>
          )}
          {mTx.state === "MINED" && (
            <div>
              Mined in Block:
              <div>
                <Link to={"block/" + mTx.finallyMinedOnBlock + "/" + algo}>
                  {mTx.finallyMinedOnBlock}
                </Link>
              </div>
            </div>
          )}
          {mTx.state === "DELETED" && <div>Deleted</div>}
          {mTx.state === "ERROR" && <div>Error</div>}
        </td>
        <td>{mTx.txId}</td>
        <td className="clickableNoUnderline" onClick={onShow}>
          {visible === false && <div>+</div>}
          {visible === true && <div>-</div>}
        </td>
      </tr>
      {visible === true && (
        <tr>
          <td colSpan="4">
            <table className="innerMisTxTable">
              <thead>
                <tr>
                  <th>Total Sat/vByte lost</th>
                  <th>Total fees lost</th>
                  <th>Time when should had been mined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{format(".6f")(mTx.totalSatvBytesLost)} </td>
                  <td>{format(",")(mTx.totalFeesLost)} </td>
                  <td>{mTx.timeWhenShouldHaveBeenMined}</td>
                </tr>
              </tbody>
            </table>
            <br />
            <div className="divIgnoringMiners">
              Ignoring miners: <b>{ignoringMiners(mTx.ignoringBlocks)}</b>
            </div>
            <div
              className="ignoringBlocks"
              style={{
                width: layout.divSize.X / 2 + "px",
                overflow: "scroll",
              }}
            >
              <table className="ignoringBlocksTable">
                <tbody>
                  <tr>
                    <td>Block#</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td key={ib.height + "height"}>
                        <Link to={"/block/" + ib.height + "/" + algo}>
                          {ib.height}
                        </Link>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>#Txs in mined block</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td key={ib.height + "txsInMinedBlock"}>
                        {ib.txsInMinedBlock}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>#Txs in candidate block</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td key={ib.height + "txsInCandidateBlock"}>
                        {ib.txsInCandidateBlock}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Position in candidate block</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td key={ib.height + "posInCandidateBlock"}>
                        {filteredGetNumberWithOrdinal(
                          ib.posInCandidateBlock + 1
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Block Time</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td key={ib.height + "BlockTime"}>
                        {new Date(ib.time).toISOString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Miner Name</td>
                    {mTx.ignoringBlocks.map((ib) => (
                      <td
                        className="CellWithComment"
                        key={ib.height + "minerName"}
                      >
                        <Link to={"/miner/" + ib.coinBaseData.minerName}>
                          {ib.coinBaseData.minerName}
                        </Link>
                        <span
                          className="CellComment"
                          style={{ top: -40 + "px" }}
                        >
                          Coinbase: {ib.coinBaseData.ascciOfField}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

function createLayout(size) {
  const margins = { horizontal: 100, vertical: 0 };

  const sizes = {
    divSize: { X: size.width - margins.horizontal },
  };

  return { ...margins, ...sizes };
}
