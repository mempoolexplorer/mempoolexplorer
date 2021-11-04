import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { petitionTo } from "../../utils/utils";

export function IgTransactionList(props) {
  const [igTxList, setIgTxList] = useState([]);

  useEffect(() => {
    petitionTo("/ignoredTxAPI/ignoredTxs", setIgTxList);
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>Transaction Id:</td>
            <td># ignored </td>
          </tr>
        </thead>
        <tbody>
          {igTxList.map((igTx) => (
            <tr key={igTx.i + igTx.n}>
              <td><Link to={"/mempool/"+ igTx.i}>{igTx.i}</Link></td>
              <td>{igTx.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
/*{JSON.stringify(igTxList, null, 2)}*/