import React, { useState, useEffect } from "react";
import { intervalToDuration, formatDuration } from "date-fns";
import { format } from "d3-format";
import { getNumberWithOrdinal } from "../../../utils/utils";
import { TxInput } from "./TxInput";
import { TxOutput } from "./TxOutput";
import "./TxDetails.css";

export function TxDetails(props) {
  const [date, setDate] = useState(new Date());

  const tx = props.data;
  const nodeTx = props.nodeData;
  const fblTxSatVByte = props.fblTxSatVByte;

  useEffect(() => {
    const timerId = setInterval(() => updateDataByTimer(), 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  function updateDataByTimer() {
    setDate(new Date());
  }

  function duration(millis) {
    const txDuration = intervalToDuration({
      start: new Date(millis),
      end: date,
    });
    return formatDuration(txDuration);
  }

  function feeAnalysis() {
    const diff = Math.floor(nodeTx.m) - fblTxSatVByte;
    if (diff === 0) return "0 % more ";
    const percent = (diff / fblTxSatVByte) * 100;

    return `${Math.floor(Math.abs(percent))} % ${
      percent < 0 ? "less " : "more "
    }`;
  }

  return (
    <div className="txDetailsDiv">
      <table className="txDetailsTable">
        <tbody>
          <tr>
            <td colSpan="2">{nodeTx.i}</td>
          </tr>
          <tr>
            <td>Containing Block</td>
            <td>{getNumberWithOrdinal(nodeTx.bi + 1)}</td>
          </tr>
          <tr>
            <td>Weight:</td>
            <td>{format(",")(nodeTx.w)}</td>
          </tr>
          <tr>
            <td>Base fee (sat):</td>
            <td>{format(",")(nodeTx.f)}</td>
          </tr>
          <tr>
            <td>Fees (Sat/VByte):</td>
            <td>{format("6f")(nodeTx.f / (nodeTx.w / 4))}</td>
          </tr>
          <tr>
            <td>CPFP Fees (Sat/VByte):</td>
            <td>{format("6f")(nodeTx.m)}</td>
          </tr>
          <tr>
            <td>Fee Analysis</td>
            <td>Tx is paying {feeAnalysis()} than last tx of first block</td>
          </tr>
          <tr>
            <td>Bip 125 Replaceable:</td>
            <td>{nodeTx.b === false ? "false" : "true"}</td>
          </tr>
          <tr>
            <td>Fist seen date:</td>
            <td>{new Date(nodeTx.t).toString()}</td>
          </tr>
          <tr>
            <td>First seen since:</td>
            <td>{duration(nodeTx.t)}</td>
          </tr>
        </tbody>
      </table>
      <p>Inputs & Outputs</p>
      <table className="txIODetailsTable">
        <tbody>
          <tr>
            <td className="IOput">
              {tx.txInputs.map((input, index) => (
                <TxInput
                  key={input.txId + input.voutIndex}
                  txInput={input}
                  index={index}
                />
              ))}
            </td>
            <td className="IOput">&gt;</td>
            <td className="IOput">
              {tx.txOutputs.map((output, index) => (
                <TxOutput key={index} txOutput={output} index={index} />
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
