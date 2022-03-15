import React from "react";
import {durationMins} from "../../utils/utils";
import "./TableFees.css";

export function TableFees(props) {
  const {feeList, estimationType} = props;

  return (
    <div>
      <h3>{estimationType} estimation</h3>
      <table className="tableFees">
        <thead>
          <tr>
            <th>
              <div>Target</div>
              <div> time</div>
            </th>
            <th>
              <div>Target</div>
              <div> block</div>
            </th>
            <th>
              <div>Suggested</div> fees (Sat/VByte)
            </th>
          </tr>
        </thead>
        <tbody>
          {feeList.map((fee, i) => (
            <tr key={i}>
              <td>~{durationMins(fee.tb * 10)}</td>
              <td>{fee.tb}</td>
              <td>
                {fee.fr} ({Math.round(fee.fr)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
