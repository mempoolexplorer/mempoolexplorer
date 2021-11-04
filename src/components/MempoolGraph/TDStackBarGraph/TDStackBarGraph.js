import React, { useEffect } from "react";
import { axisLeft, axisRight } from "d3-axis";
import { format } from "d3-format";
import { path } from "d3-path";
import { select, selectAll } from "d3-selection";
import { interpolateHcl } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import "./TDStackBarGraph.css";

const clone = require("rfdc")();

export const TDStackBarGraphProps = {
  verticalSize: "verticalSize",
  barWidth: "barWidth",
  by: "by",
  byOpt: { byLeft: "byLeft", byRight: "byRight", byBoth: "byBoth" },
  data: "data",
};

export function TDStackBarGraph(props) {
  const { data, by } = props;
  const cValues = prepareData(data.values, data.fnValues);

  const layout = createLayout(props);
  let scales = null;
  if (cValues != null) {
    scales = createScales(by, layout, cValues, data);

    //Enlarge graphic if it does not fit
    layout.size.Y =
      scales.scaleLeft(cValues.totalLD) +
      layout.graphMargin.graphMarginVertical;

    //console.log(data.values);
    //console.log(cValues);
  }
  //UseEffect Hook
  useEffect(() => {
    dataViz(data, cValues, by, layout, scales, data.id);
  });

  return (
    <div
      className={data.id}
      style={{
        width: layout.outerSize.X + "px",
        height: layout.outerSize.Y + "px",
        overflowY: "scroll",
      }}
    >
      <svg
        id={"svg" + data.id}
        width={layout.size.X}
        height={layout.size.Y}
      ></svg>
    </div>
  );
}

function prepareData(values, fnValues) {
  if (values == null) return null;
  const { fnLDValue, fnRDValue, fnCDValue } = fnValues;
  let cValues = {};
  cValues.values = clone(values);
  cValues.totalLD = 0;
  cValues.totalRD = 0;
  cValues.totalCD = 0;
  cValues.maxLD = 0;
  cValues.maxRD = 0;
  cValues.maxCD = 0;
  cValues.minLD = Number.MAX_VALUE;
  cValues.minRD = Number.MAX_VALUE;
  cValues.minCD = Number.MAX_VALUE;
  Object.values(cValues.values).forEach((e, i, a) => {
    const lv = fnLDValue(e);
    const rv = fnRDValue(e);
    const cv = fnCDValue(e);
    cValues.totalLD += lv;
    cValues.totalRD += rv;
    cValues.totalCD += cv;
    cValues.maxLD = Math.max(cValues.maxLD, lv);
    cValues.maxRD = Math.max(cValues.maxRD, rv);
    cValues.maxCD = Math.max(cValues.maxCD, cv);
    cValues.minLD = Math.min(cValues.minLD, lv);
    cValues.minRD = Math.min(cValues.minRD, rv);
    cValues.minCD = Math.min(cValues.minCD, cv);

    if (i === 0) {
      e.acumLDValue = 0;
      e.acumRDValue = 0;
    } else {
      e.acumLDValue = a[i - 1].acumLDValue + fnLDValue(a[i - 1]);
      e.acumRDValue = a[i - 1].acumRDValue + fnRDValue(a[i - 1]);
    }
    e.index = i;
  });
  return cValues;
}

function createLayout(props) {
  const sizeY = props.verticalSize;
  const graphMarginVertical = 20;
  const vTextSize = 12;

  const layout = {
    size: { Y: sizeY },
    outerSize: {},
    graphMargin: { up: 10, down: 10, graphMarginVertical },
    barSize: {
      X: props.barWidth,
      Y: sizeY - graphMarginVertical,
    },
    axisMargin: { left: 40, right: 40, both: 80 },
    textMargin: { left: 15, right: 15, both: 30 },
    vTextSize: vTextSize,
    vTextSizeStr: vTextSize + "px",
    rightVerticalTextCorrection: 10,
    pxMin: 1,
  };

  layout.graphMargin.horizontal =
    layout.axisMargin.both +
    layout.textMargin.both -
    layout.rightVerticalTextCorrection;
  layout.size.X = layout.barSize.X + layout.graphMargin.horizontal;
  layout.outerSize.X = layout.size.X + 15;
  layout.outerSize.Y = layout.size.Y + 10;
  return layout;
}

//Create the left, right and color scales
function createScales(propsBy, layout, cValues, data) {
  const { colorRange } = data;
  const { barSize, pxMin } = layout;
  const { totalLD, totalRD, maxCD, minLD, minRD, minCD } = cValues;

  const scales = {};

  //Various scales
  scales.scaleLeft = scaleLinear().domain([0, totalLD]).range([0, barSize.Y]);

  scales.scaleRight = scaleLinear().domain([0, totalRD]).range([0, barSize.Y]);

  scales.scaleColor = scaleLinear()
    .interpolate(interpolateHcl)
    .domain([minCD, maxCD])
    .range(colorRange);

  let maxHeight;

  if (propsBy === "byLeft") {
    if (scales.scaleLeft(minLD) < pxMin) {
      scales.scaleLeft = scaleLinear().domain([0, minLD]).range([0, pxMin]);
    }
    maxHeight = scales.scaleLeft(totalLD);
  } else if (propsBy === "byRight") {
    if (scales.scaleRight(minRD) < pxMin) {
      scales.scaleRight = scaleLinear().domain([0, minRD]).range([0, pxMin]);
    }
    maxHeight = scales.scaleRight(totalRD);
  } else if (propsBy === "byBoth") {
    if (scales.scaleLeft(minLD) < pxMin && scales.scaleRight(minRD) < pxMin) {
      scales.scaleLeft = scaleLinear().domain([0, minLD]).range([0, pxMin]);
      scales.scaleRight = scaleLinear().domain([0, minRD]).range([0, pxMin]);
    }
    maxHeight = Math.max(scales.scaleLeft(totalLD), scales.scaleRight(totalRD));
  } else {
    console.log("props.by not allowed");
  }

  scales.scaleLeft = scaleLinear().domain([0, totalLD]).range([0, maxHeight]);
  scales.scaleRight = scaleLinear().domain([0, totalRD]).range([0, maxHeight]);

  return scales;
}

function dataViz(data, cValues, by, layout, scales) {
  const { id, tickFormat } = data;
  const svg = select("#svg" + id);
  svg.selectAll("*").remove();

  const infobox = select("#Infobox" + id);
  if (!infobox.empty()) {
    infobox.remove();
  }
  if (cValues != null) {
    //groups all graph elements and transate them
    const graph = svg
      .append("g")
      .attr("id", "svgGroup" + id)
      .attr("transform", "translate(0," + layout.graphMargin.up + ")");

    drawBar(graph, data, cValues, by, layout, scales);

    const axis = axisBy(by, scales, tickFormat);
    drawAxis(graph, layout, axis, id);

    drawVerticalTexts(graph, by, layout);
  }
}

function drawBar(graph, data, cValues, by, layout, scales) {
  const {
    id,
    strokeWidth,
    fnOnSelected,
    fnOnSelectedEval,
    fnValues,
    selectedIndex,
  } = data;
  const { textMargin, axisMargin } = layout;
  const { scaleColor } = scales;

  graph
    .append("g")
    .attr("id", "innerGroup" + id)
    .attr(
      "transform",
      "translate(" + (textMargin.left + axisMargin.left) + ",0)"
    )
    .selectAll("path")
    .data(cValues.values)
    .enter()
    .append("path")
    .style("fill", colorize) //(e) => scaleColor(fnValues.fnCDValue(e)))
    .style("stroke", "grey")
    .style("stroke-width", strokeWidth)
    .attr("d", barPathFunction(by, layout, scales, fnValues))
    .on("click", elementClick)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    .on("mousemove", mouseMove);

  function colorize(e) {
    if (fnOnSelectedEval(e) === selectedIndex) {
      return "DarkSlateGray";
    } else {
      return scaleColor(fnValues.fnCDValue(e));
    }
  }

  function elementClick(event, datum) {
    fnOnSelected(fnOnSelectedEval(datum));
  }

  function mouseOver(event, datum) {
    const { htmlTip, htmlTipData } = data;
    select(this).style("fill", "grey");

    if (select("#Infobox" + id).empty()) {
      select("body")
        .append("div")
        .attr("id", "Infobox" + id)
        .html(htmlTip)
        .style("position", "fixed")
        .style("z-index", "1")
        .style("background", "lightgrey")
        .style("border", "1px black solid")
        .style("border-radius", "10px")
        .style("pointer-events", "none")
        .style("left", event.clientX + 10 + "px")
        .style("top", event.clientY + 10 + "px");

      selectAll("td.TipData")
        .data(htmlTipData)
        .html((e) => e(datum));
    }
  }

  function mouseOut(event, datum) {
    select(this).style("fill", colorize(datum)); //(e) => scaleColor(fnValues.fnCDValue(e)));

    const infobox = select("#Infobox" + id);
    if (!infobox.empty()) {
      infobox.remove();
    }
  }

  function mouseMove(event) {
    const infobox = select("#Infobox" + id);
    if (!infobox.empty()) {
      infobox
        .style("left", event.clientX + 10 + "px")
        .style("top", event.clientY + 10 + "px");
    }
  }
}

//Returns a path for a block, given x, y(left and right), height(left and right) and width
//Draw a path Clockwise form upper left corner
function pathFrom(x, yl, yr, hl, hr, w) {
  var pathRes = path();
  pathRes.moveTo(x, yl);
  pathRes.lineTo(x + w, yr);
  pathRes.lineTo(x + w, yr + hr);
  pathRes.lineTo(x, yl + hl);
  pathRes.closePath();
  return pathRes.toString();
}

//Returns the function that draws the path from  data (candidateBlockRecap)
//depending on props.by
function barPathFunction(by, layout, scales, fnValues) {
  const { fnLDValue, fnRDValue } = fnValues;
  const { scaleLeft, scaleRight } = scales;
  const { barSize } = layout;

  if (by === "byRight") {
    return (e) =>
      pathFrom(
        0,
        scaleRight(e.acumRDValue),
        scaleRight(e.acumRDValue),
        scaleRight(fnRDValue(e)),
        scaleRight(fnRDValue(e)),
        barSize.X
      );
  } else if (by === "byLeft") {
    return (e) =>
      pathFrom(
        0,
        scaleLeft(e.acumLDValue),
        scaleLeft(e.acumLDValue),
        scaleLeft(fnLDValue(e)),
        scaleLeft(fnLDValue(e)),
        barSize.X
      );
  } else if (by === "byBoth") {
    return (e) =>
      pathFrom(
        0,
        scaleLeft(e.acumLDValue),
        scaleRight(e.acumRDValue),
        scaleLeft(fnLDValue(e)),
        scaleRight(fnRDValue(e)),
        barSize.X
      );
  } else {
    console.log("props.by not allowed");
  }
}

function axisBy(propsBy, scales, ticFormat) {
  const { scaleLeft, scaleRight } = scales;

  const axis = { left: null, right: null };
  if (propsBy === "byRight") {
    axis.left = axisLeft()
      .scale(scaleRight)
      .tickFormat(format(ticFormat.byRightAxisLeft));
  } else if (propsBy === "byLeft" || propsBy === "byBoth") {
    axis.left = axisLeft()
      .scale(scaleLeft)
      .tickFormat(format(ticFormat.byLeftOrBothAxisLeft));
    if (propsBy === "byBoth") {
      axis.right = axisRight()
        .scale(scaleRight)
        .tickFormat(format(ticFormat.byBothAxisRight));
    }
  }
  return axis;
}

function drawAxis(graph, layout, axis, id) {
  const { textMargin, axisMargin, barSize } = layout;

  if (axis.left !== null) {
    graph
      .append("g")
      .attr("id", id + "LeftAxis")
      .attr(
        "transform",
        "translate(" + (textMargin.left + axisMargin.left) + ",0)"
      )
      .call(axis.left);
  }
  if (axis.right !== null) {
    graph
      .append("g")
      .attr("id", id + "RightAxis")
      .attr(
        "transform",
        "translate(" + (textMargin.left + axisMargin.left + barSize.X) + ",0)"
      )
      .call(axis.right);
  }
}

function drawVerticalTexts(graph, propsBy, layout) {
  drawLeftVerticalText(graph, propsBy, layout);
  drawRightVerticalText(graph, propsBy, layout);
}

function drawLeftVerticalText(graph, propsBy, layout) {
  const { textMargin, barSize, vTextSizeStr } = layout;

  let lText = "Weight in Mb";
  let vCorrection = 45;
  if (propsBy === "byRight") {
    lText = "Unconfirmed Tx count";
    vCorrection = 65;
  }

  const textWeightPos = { X: textMargin.left, Y: barSize.Y / 2 + vCorrection };
  graph
    .append("text")
    .text(lText)
    .attr("x", textWeightPos.X)
    .attr("y", textWeightPos.Y)
    .attr(
      "transform",
      "rotate(-90 " + textWeightPos.X + "," + textWeightPos.Y + ")"
    )
    .style("font-size", vTextSizeStr);
}

function drawRightVerticalText(graph, propsBy, layout) {
  if (propsBy !== "byBoth") return;
  const {
    textMargin,
    barSize,
    vTextSize,
    rightVerticalTextCorrection,
    vTextSizeStr,
    axisMargin,
  } = layout;

  const textNumTxPos = {
    X:
      axisMargin.both +
      textMargin.both +
      barSize.X -
      (vTextSize + rightVerticalTextCorrection),
    Y: barSize.Y / 2 - 60,
  };
  graph
    .append("text")
    .text("Unconfirmed Tx count")
    .attr("x", textNumTxPos.X)
    .attr("y", textNumTxPos.Y)
    .attr(
      "transform",
      "rotate(90 " + textNumTxPos.X + "," + textNumTxPos.Y + ")"
    )
    .style("font-size", vTextSizeStr);
}
