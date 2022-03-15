import React, {useState} from "react";
import {format} from "d3-format";
import {durationMins, getNumberWithOrdinal} from "../../../utils/utils";
import "./Position.css";

export function Position(props) {
  const data = props.data;
  const [posInBlock, aheadWeightInBlock] = calcPositionsInBlock();
  const [aheadTx, aheadWeight] = calcAhead();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <table className="positionTable">
        <thead>
          <tr>
            <th>Time to be mined:</th>
            <th colSpan="2">~ {durationMins(etaMin())}{" "}
              <button onClick={onShow}>
                {visible === false && <div>+</div>}
                {visible === true && <div>-</div>}
              </button>
            </th>
          </tr>
        </thead>
        {visible &&
          <React.Fragment>
            <tbody>
              <tr>
                <td>Transaction is in:</td>
                <td colSpan="2">{getNumberWithOrdinal(data.blockSelected + 1)} block
                </td>
              </tr>
              <tr>
                <td>Position in block:</td>
                <td>{percentage(posInBlock, getTotalTxInBlock())}%</td>
                <td> {getNumberWithOrdinal(posInBlock)} of {getTotalTxInBlock()} transactions </td>
              </tr>
              <tr>
                <td>Position in block (weight):</td>
                <td>{percentage(aheadWeightInBlock, getTotalWeighInBlock())}%</td>
                <td> {format(",")(aheadWeightInBlock)} vBytes of {format(",")(getTotalWeighInBlock())} vBytes </td>
              </tr>
              <tr>
                <td>Total transactions ahead:</td>
                <td colSpan="2">{aheadTx}</td>
              </tr>
              <tr>
                <td>Total weight ahead:</td>
                <td colSpan="2">{format(",")(aheadWeight)} vBytes</td>
              </tr>
            </tbody>
          </React.Fragment >
        }
      </table>
    </div>
  );

  function onShow() {
    setVisible(!visible);
  }

  function etaMin() {//Pulled out of my sleeve
    const weightToAdd = data.weightInLast10minutes * (data.blockSelected + 1);
    const mempoolSize = calcTotalWeight();
    const adjustedMPSize = mempoolSize + weightToAdd;
    const ratio = adjustedMPSize / mempoolSize;
    const adjustedAheadWeight = aheadWeight * ratio;
    const adjustedMiningBlock = Math.trunc(adjustedAheadWeight / 4000000);
    return (adjustedMiningBlock + 1) * 10;
  }

  function calcTotalWeight() {
    let totalWeight = 0;
    data.mempool.forEach((element) => {
      totalWeight += element.w;
    });
    return totalWeight;
  }

  function calcAhead() {
    let aheadWeight = 0;
    let aheadTx = 0;
    data.mempool.every((element, index) => {
      if (index === data.blockSelected) {
        return false;
      }
      aheadWeight += element.w;
      aheadTx += element.n;
      return true;
    });
    aheadWeight += aheadWeightInBlock;
    aheadTx += posInBlock;
    return [aheadTx - 1, aheadWeight];
  }

  function calcPositionsInBlock() {
    let sumWeight = 0;
    let sumPos = 0;

    data.blockHistogram.every((element) => {
      if (data.satVByteSelected === element.m) {
        return false;
      }
      sumWeight += element.w;
      sumPos += element.n;
      return true;
    });

    sumPos += data.txIndexSelected + 1;

    data.satVByteHistogram.every((element, index) => {
      if (index === data.txIndexSelected) {
        return false;
      }
      sumWeight += element.w;
      return true;
    })

    return [sumPos, sumWeight];
  }

  function percentage(partialValue, totalValue) {
    return ((100 * partialValue) / totalValue).toFixed(2);
  }

  function getTotalTxInBlock() {
    return data.mempool[data.blockSelected].n;
  }

  function getTotalWeighInBlock() {
    return data.mempool[data.blockSelected].w;
  }
}
