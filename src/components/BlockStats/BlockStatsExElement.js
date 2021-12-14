import React, { useState } from "react";
import { format } from "d3-format";
import "./BlockStatsExElement.css";

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

export function BlockStatsExElement(props) {
  const {
    expanded,
    lateralMsg,
    inMempool,
    inMinedBlock,
    inCandidateBlock,
    meaning,
    numTxs,
    weight,
    fees,
  } = props;

  const [exp, setExp] = useState(expanded);

  function onExp() {
    setExp(!exp);
  }

  function expRowSpan() {
    if (exp) return "4";
    return "1";
  }

  return (
    <React.Fragment>
      <tr style={{ borderTop: exp ? "3px solid grey" : "1px" }}>
        {lateralMsg !== "" && (
          <td rowSpan="32" className="vertText">
            <span>{lateralMsg}</span>
          </td>
        )}
        <td rowSpan={expRowSpan()}>{inMempool}</td>
        <td rowSpan={expRowSpan()}>{inMinedBlock}</td>
        <td rowSpan={expRowSpan()}>{inCandidateBlock}</td>
        <td rowSpan={expRowSpan()}>{meaning}</td>
        <td className="stripped"># Txs:</td>
        <td className="stripped">{formatMinusOne(numTxs, 0)}</td>
        <td
          rowSpan={expRowSpan()}
          className="clickableNoUnderline"
          onClick={onExp}
        >
          {exp === false && <div>+</div>}
          {exp === true && <div>-</div>}
        </td>
      </tr>
      {exp === true && (
        <React.Fragment>
          <tr>
            <td className="stripped">
              <>&sum;</> Weight:
            </td>
            <td className="stripped">{formatMinusOne(weight, "-")}</td>
          </tr>
          <tr>
            <td className="stripped">
              <>&sum;</> Fees:
            </td>
            <td className="stripped">{formatMinusOne(fees, "-")}</td>
          </tr>
          {/* <tr style={"border-bottom: 3px solid grey"}> */}
          <tr
            style={{
              borderBottom: "3px solid grey",
            }}
          >
            <td className="stripped">Avg. Sat/VByte:</td>
            <td className="stripped">{formatSatVByte(fees, weight)}</td>
          </tr>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
