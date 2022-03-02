import React from "react";
import { intervalToDuration, formatDuration } from "date-fns";
import "./TableFees.css";

export function TableFees(props) {
  const { feeList, estimationType } = props;

  function duration(minutes) {
    const durationStr = formatDuration(
      intervalToDuration({
        start: new Date(0, 0, 0, 0, 0, 0),
        end: new Date(0, 0, 0, 0, minutes, 0),
      })
    );
    if (durationStr === undefined) return "0 seconds";
    return durationStr;
  }

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
              <td>~{duration(fee.tb * 10)}</td>
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
