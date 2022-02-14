import React, { useEffect, useState } from "react";
import { bitcoindAdapterPetitionTo } from "../../utils/utils";
import "./FeeEstimation.css";
import { TableFees } from "./TableFees";

export function FeeEstimation() {
  const [fees, setFees] = useState({
    csfl: [],
    nsfl: [],
    esfl: [],
  });

  useEffect(() => {
    bitcoindAdapterPetitionTo("/smartFees", setFees);
  }, []);

  return (
    <div className="smartFeesdiv">
      <h2>Bitcoind estimated fees</h2>
      <table className="divExpFees">
        <tbody>
          <tr>
            <td>
              This is the output of calling RPC <code>estimatesmartfee</code> in
              our bitcoind node
            </td>{" "}
          </tr>
          <tr>
            <td>
              Non valid estimations as declared in RPC{" "}
              <code>estimatesmartfee</code> help are not shown
            </td>{" "}
          </tr>
          <tr>
            <td>
              Results in satoshis per VByte are rounded to the nearest integer
              between parenthesis
            </td>{" "}
          </tr>
        </tbody>
      </table>{" "}
      <div className="row">
        <div className="column">
          <TableFees feeList={fees.csfl} estimationType="Conservative" />
        </div>
        <div className="column">
          <TableFees feeList={fees.nsfl} estimationType="Normal" />
        </div>
        <div className="column">
          <TableFees feeList={fees.esfl} estimationType="Economic" />
        </div>
      </div>
    </div>
  );
}
/*{JSON.stringify(igTxList, null, 2)}*/
