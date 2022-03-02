import { format } from "d3-format";
import { intervalToDuration, formatDuration } from "date-fns";
import { getNumberWithOrdinal } from "../../utils/utils";

export function dataForForceGraph(data, onTxIdSelected) {
  return {
    nodes: data.txDependenciesInfo.nodes,
    edges: data.txDependenciesInfo.edges,
    nodeIdFn: (node) => node.txId,
    edgeOriginFn: (edge) => edge.o,
    edgeDestinationFn: (edge) => edge.d,
    fnOnSelected: onTxIdSelected,
    fnOnSelectedEval: (n) => n.txId,
    htmlTip: `
      <table class="toolTipTable">
          <tr><td>TxId:</td><td class="FGTipData"></td></tr>
          <tr><td>Containing block:</td><td class="FGTipData"></td></tr>
          <tr><td>Weight:</td><td class="FGTipData"></td></tr>
          <tr><td>Base fee (sat):</td><td class="FGTipData"></td></tr>
          <tr><td>SatVByte:</td><td class="FGTipData"></td></tr>
          <tr><td>CPFP SatVByte:</td><td class="FGTipData"></td></tr>
          <tr><td>Replaceable:</td><td class="FGTipData"></td></tr>
          <tr><td>Fist seen date:</td><td class="FGTipData"></td></tr>
          <tr><td>First seen since:</td><td class="FGTipData"></td></tr>
      </table>`,
    htmlTipData: [
      (n) => n.txId,
      (n) => getNumberWithOrdinal(n.containingBlockIndex + 1),
      (n) => format(",")(n.weight),
      (n) => format(",")(n.baseFee),
      (n) => format(".6f")(n.baseFee / (n.weight / 4)),
      (n) => format(".6f")(n.modifiedSatVByte),
      (n) => n.bip125Replaceable,
      (n) => new Date(n.timeInMillis),
      (n) => {
        const duration = intervalToDuration({
          start: new Date(n.timeInMillis),
          end: new Date(),
        });
        return formatDuration(duration);
      },
    ],
  };
}

export function dataForMiningQueueGraph(data, onBlockSelected, selectedIndex) {
  return {
    id: "MiningQueueGraph",
    adData: {}, // whathever more needed
    values: data.mempool, //Array of values to draw
    fnValues: {
      fnLDValue: (e) => e.w, //Left dimension value function: weight
      fnRDValue: (e) => e.n, //Right dimension value function: numTxs
      fnCDValue: (e) => e.t, //Color dimension value function: totalFees
    },
    selectedIndex: selectedIndex,
    strokeWidth: "1",
    colorRange: ["LightGreen", "red"],
    fnOnSelected: onBlockSelected, //when block is selected
    fnOnSelectedEval: (e) => e.index,
    tickFormat: {
      byRightAxisLeft: "~s",
      byLeftOrBothAxisLeft: "~s",
      byBothAxisRight: "~s",
    },
    htmlTip: `
        <table class="toolTipTable">
            <tr><td>Block#:</td><td class="TipData"></td></tr>
            <tr><td>Weight:</td><td class="TipData"></td></tr>
            <tr><td>Total Fees (sat):</td><td class="TipData"></td></tr>
            <tr><td>Txs#:</td><td class="TipData"></td></tr>
            <tr><td>satVByte (average):</td><td class="TipData"></td></tr>
        </table>`,
    htmlTipData: [
      (e) => getNumberWithOrdinal(e.index + 1),
      (e) => format(",")(e.w),
      (e) => format(",")(e.t),
      (e) => e.n,
      (e) => format(".6f")(e.t / (e.w / 4)),
    ],
  };
}

export function dataForBlockGraph(data, onSatVByteSelected, selectedIndex) {
  return {
    id: "BlockGraph",
    adData: {}, // whathever more needed
    values: data.blockHistogram, //Array of values to draw
    fnValues: {
      fnLDValue: (e) => e.w, //Left dimension value function: weight
      fnRDValue: (e) => e.n, //Right dimension value function: numTxs
      fnCDValue: (e) => e.m, //Color dimension value function: modSatVByte
    },
    selectedIndex: selectedIndex,
    strokeWidth: "0.5",
    colorRange: ["LightGreen", "red"],
    fnOnSelected: onSatVByteSelected, //when satVByte is selected
    fnOnSelectedEval: (e) => e.m,
    tickFormat: {
      byRightAxisLeft: "~s",
      byLeftOrBothAxisLeft: "~s",
      byBothAxisRight: "~s",
    },
    htmlTip: `
        <table class="toolTipTable">
            <tr><td>CPFP SatVByte:</td><td class="TipData"></td></tr>
            <tr><td>Txs#:</td><td class="TipData"></td></tr>
            <tr><td>Weight:</td><td class="TipData"></td></tr>
        </table>`,
    htmlTipData: [(e) => e.m, (e) => e.n, (e) => format(",")(e.w)],
  };
}

export function dataForTxsGraph(data, onTxIndexSelected, selectedIndex) {
  return {
    id: "TxsGraph",
    adData: {}, // whathever more needed
    values: data.satVByteHistogram, //Array of values to draw
    fnValues: {
      fnLDValue: (e) => e.w, //Left dimension value function: weight
      fnRDValue: (e) => 1, //Right dimension value function: Always 1
      fnCDValue: (e) => 1, //Color dimension value function: Always 1
    },
    selectedIndex: selectedIndex,
    strokeWidth: "0.5",
    colorRange: ["LightGreen", "red"],
    fnOnSelected: onTxIndexSelected, //when TxIndex is selected
    fnOnSelectedEval: (e) => e.index,
    tickFormat: {
      byRightAxisLeft: "~s",
      byLeftOrBothAxisLeft: "~s",
      byBothAxisRight: "",
    },
    htmlTip: `
        <table class="toolTipTable">
            <tr><td>Tx:</td><td class="TipData"></td></tr>
            <tr><td>Weight:</td><td class="TipData"></td></tr>
        </table>`,
    htmlTipData: [
      (e) => getNumberWithOrdinal(e.index + 1),
      (e) => format(",")(e.w),
    ],
  };
}
