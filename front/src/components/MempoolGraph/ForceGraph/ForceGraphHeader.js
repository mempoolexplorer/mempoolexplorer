import React from "react";

export function ForceGraphHeader(props) {
  function onChangedInteractive(event) {
    const checked = event.target.checked;
    props.setInteractive(checked);
  }
  return (
    <div>
      <label>
        <input
          id="interactiveChecker"
          type="checkbox"
          checked={props.interactive}
          onChange={onChangedInteractive}
        />
        Interactive Mode
      </label>
    </div>
  );
}
