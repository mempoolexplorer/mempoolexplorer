import React from "react";
import "./BlockStatsList.css";
import { format } from "d3-format";
import { Link } from "react-router-dom";

const clone = require("rfdc")();

export function BlockStatsList(props) {
  const { igBlockList, onNextPage, onPrevPage } = props;

  const igBList = clone(igBlockList);

  igBList.sort((bA, bB) => bB.h - bA.h);

  return (
    <div>
      <table className="blockStatsList">
        <thead>
          <tr>
            <th>Height</th>
            <th>Miner name</th>
            <th>Lost reward</th>
            <th>
              <div>Lost reward</div> <div>excl. not in our</div>mempool txs
            </th>
            <th>Block date:</th>
            <th>
              <div>#Txs in</div> mined block
            </th>
            <th>
              <div>#Txs in</div> candidate block
            </th>
            <th>
              <div>#Txs in mempool </div> when mined
            </th>
          </tr>
        </thead>
        <tbody>
          {igBList.map((igb) => (
            <tr key={igb.h}>
              <td>
                <Link to={"/block/" + igb.h}>{igb.h}</Link>
              </td>
              <td className="CellWithComment">
                <Link to={"/miner/" + igb.mn}>{igb.mn}</Link>
                <span className="CellComment">Coinbase: {igb.cb}</span>
              </td>
              <td>{format(",")(igb.lr)}</td>
              <td>{format(",")(igb.lreNIM)}</td>
              <td>{new Date(igb.t).toISOString()}</td>
              <td>{format(",")(igb.nInMB)}</td>
              <td>{format(",")(igb.nInCB)}</td>
              <td>{format(",")(igb.nInMP)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={onPrevPage}>Prev</button>
        <button onClick={onNextPage}>Next</button>
      </div>
    </div>
  );
}
