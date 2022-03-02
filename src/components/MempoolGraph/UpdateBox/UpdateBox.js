import React, { useState, useEffect } from "react";
import { intervalToDuration, formatDuration } from "date-fns";
import "./UpdateBox.css";
export function UpdateBox(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => updateDataByTimer(), 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  });

  function updateDataByTimer() {
    setDate(new Date());
  }

  function onChangedLock(event) {
    const checked = event.target.checked;
    props.setLockMempool(checked);
  }

  function duration(millis) {
    const txDuration = intervalToDuration({
      start: new Date(millis),
      end: date,
    });
    return formatDuration(txDuration);
  }

  return (
    props.lastUpdate !== undefined && (
      <div id="updateBoxDiv">
        <label>
          <input
            id="lockMempool"
            type="checkbox"
            checked={props.lockMempool}
            onChange={onChangedLock}
          />
          Lock mempool
        </label>
        <br></br>
        last update: {duration(props.lastUpdate)}
      </div>
    )
  );
}
