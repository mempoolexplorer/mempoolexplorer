import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {format} from "d3-format";
import React, {useState} from "react";

export function Amount(props) {
  const {sats, unit, setUnit, btcusd, onlyButton, onlyValue} = props;
  const [ownUnit, setOwnUnit] = useState(unit);
  function onChange() {
    if (setUnit !== undefined) {
      if (unit === "SAT") setUnit("USD");
      if (unit === "USD") setUnit("BTC");
      if (unit === "BTC") setUnit("SAT");
    } else {
      if (ownUnit === "SAT") setOwnUnit("USD");
      if (ownUnit === "USD") setOwnUnit("BTC");
      if (ownUnit === "BTC") setOwnUnit("SAT");
    }
  }
  function getValue() {
    if (setUnit !== undefined) {
      if (unit === "SAT") return format(",")(sats);
      if (unit === "BTC") return format(",")(satsToBTC());
      if (unit === "USD") return format(",.2f")(satsToBTC() * btcusd);
    } else {
      if (ownUnit === "SAT") return format(",")(sats);
      if (ownUnit === "BTC") return format(",")(satsToBTC());
      if (ownUnit === "USD") return format(",.2f")(satsToBTC() * btcusd);
    }
  }
  function satsToBTC() {
    return sats / 100000000;
  }

  return (
    <>
      {onlyValue && onlyButton && <></>}
      {onlyValue &&
        <>
          {getValue()}
        </>
      }
      {onlyButton &&
        < Button variant="outlined" size="small"
          onClick={() => onChange()}
          sx={{minHeight: 0, minWidth: 0, maxHeight: 20, padding: '1px', color: 'white'}}>
          {setUnit !== undefined ? unit : ownUnit}
        </Button >
      }
      {!onlyButton && !onlyValue &&
        <Box>
          {getValue()}
          < Button variant="outlined" size="small" color="secondary"
            onClick={() => onChange()}
            sx={{minHeight: 0, minWidth: 0, maxHeight: 20, ml: 1, padding: '1px', color: 'white'}}>
            {setUnit !== undefined ? unit : ownUnit}
          </Button >
        </Box >
      }
    </>
  );
}
