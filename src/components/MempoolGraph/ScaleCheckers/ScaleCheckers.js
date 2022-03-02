import React, { useState } from "react";

import "./ScaleCheckers.css";

export function ScaleCheckers(props) {
  function stateFrom(by) {
    if (by === "byBoth") return { left: true, right: true };
    if (by === "byLeft") return { left: true, right: false };
    if (by === "byRight") return { left: false, right: true };
    return { left: true, right: true };
  }
  const [checks, setChecks] = useState(stateFrom(props.by));

  function byFrom(left, right) {
    if (left && right) {
      return "byBoth";
    }
    if (left) return "byLeft";
    if (right) return "byRight";
    return "byBoth";
  }

  function onChangedLeft(event) {
    const left =
      event.target.checked || (!event.target.checked && !checks.right);
    setChecks({ left: left, right: checks.right });
    props.onChange(byFrom(left, checks.right));
  }

  function onChangedRight(event) {
    const right =
      event.target.checked || (!event.target.checked && !checks.left);
    setChecks({ left: checks.left, right: right });
    props.onChange(byFrom(checks.left, right));
  }

  return (
    <div>
      <label className="label"> {props.label}</label>
      <label className="left">
        <input type="checkbox" checked={checks.left} onChange={onChangedLeft} />
        {props.leftText}
      </label>
      <label>
        <input
          type="checkbox"
          checked={checks.right}
          onChange={onChangedRight}
        />
        {props.rightText}
      </label>
    </div>
  );
}
