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
            <td>Height</td>
            <td>Miner name</td>
            <td>Lost reward</td>
            <td>Lost reward excluding not in mempool txs</td>
            <td>Block date:</td>
            <td>#Txs in mined block</td>
            <td>#Txs in candidate block</td>
            <td>#Txs in mempool when mined</td>
          </tr>
        </thead>
        <tbody>
          {igBList.map((igb) => (
            <tr key={igb.h}>
              <td>
                <Link to={"/block/" + igb.h}>{igb.h}</Link>
              </td>
              <td>
                <Link to={"/miner/" + igb.mn}>{igb.mn}</Link>
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
