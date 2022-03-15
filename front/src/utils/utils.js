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

