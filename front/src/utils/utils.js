import {json} from "d3-fetch";
import {intervalToDuration, formatDuration} from "date-fns";

export function getNumberWithOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function txMempoolPetitionTo(petition, onFunction) {
  petition = process.env.REACT_APP_GATEWAY + petition;

  json(petition)
    .then((incomingData) => {
      console.log("petition at " + petition);
      onFunction(incomingData);
    })
    .catch((error) => console.log(error));
}


export function filteredGetNumberWithOrdinal(pos) {
  if (pos === 0) return "Not Available";
  else return getNumberWithOrdinal(pos);
}

export function durationMins(minutes) {
  const durationStr = formatDuration(
    intervalToDuration({
      start: new Date(0, 0, 0, 0, 0, 0),
      end: new Date(0, 0, 0, 0, minutes, 0),
    })
  );
  if (durationStr === undefined) return "0 seconds";
  return durationStr;
}

export function stringTruncateFromCenter(str, percent) {
  let maxLength = Math.ceil(str.length * percent);
  const midChar = "…";      // character to insert into the center of the result
  var left, right;
  if (str.length <= maxLength) return str;
  // length of beginning part      
  left = Math.ceil(maxLength / 2);
  // start index of ending part   
  right = str.length - Math.floor(maxLength / 2) + 1;
  return str.substring(0, left) + midChar + str.substring(right);
}

export function splitStrDate(str) {
  const ar1 = str.split("T");
  if (ar1.length !== 2) return "invalid date";
  const ar2 = ar1[1].split(".");
  if (ar2.length !== 2) return "invalid date";
  return [ar1[0], ar2[0]];
}

export function hasGraphInfoFrom(data) {
  return data.txDependenciesInfo !== undefined && data.txDependenciesInfo !== null && data.txDependenciesInfo.nodes !== null && data.txDependenciesInfo.nodes.length !== 1;
}

export function isTxIgnoredFrom(data) {
  const igDataBT = data.txIgnoredDataBT;
  const igDataOurs = data.txIgnoredDataOurs;
  if (igDataBT === undefined || igDataOurs === undefined || igDataBT === null || igDataOurs === null) return false;
  if (
    igDataBT.ignoringBlocks.length !== 0 ||
    igDataOurs.ignoringBlocks.length !== 0
  )
    return true;
  return false;
}
