import React, { useEffect } from "react";
import { axisLeft } from "d3-axis";
import { format } from "d3-format";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";

import "./TxSpeedGraph.css";

const avgSpeed = 4000000; //4M each 10 minutes (aprox)

export function TxSpeedGraph(props) {
  const maxSpeed = Math.max(avgSpeed, props.speed);

  const layout = createLayout(props);

  const scale = scaleLinear().domain([0, maxSpeed]).range([props.height, 0]);

  //UseEffect Hook
  useEffect(() => {
    dataViz(props.width, props.height, props.speed, layout, scale);
  });

  return (
    <div
      className="divSpeedChart"
      style={{
        width: layout.divSize.w + "px",
        height: layout.divSize.h + "px",
      }}
    >
      <svg
        id="svgSpeedChart"
        width={layout.svgSize.w}
        height={layout.svgSize.h}
      ></svg>
    </div>
  );
}

function createLayout(props) {
  const vTextSize = 12;

  const margins = {
    graphMargin: { up: 10, left: 10 },
    textMargin: { up: 10, left: 10 },
    axisMargin: { up: 10, left: 45 },
    blockMargin: { up: 0, left: 10 },
  };
  const sizes = {
    divSize: {
      w:
        Number(props.width) + margins.textMargin.left + margins.axisMargin.left,
      h: Number(props.height) + margins.textMargin.up + margins.axisMargin.up,
    },
    svgSize: {
      w:
        Number(props.width) + margins.textMargin.left + margins.axisMargin.left,
      h: Number(props.height) + margins.textMargin.up + margins.axisMargin.up,
    },
    barWidth: props.barWidth,
    vTextSize: vTextSize,
    vTextSizeStr: vTextSize + "px",
  };
  return { ...margins, ...sizes };
}

function dataViz(w, h, speed, layout, scale) {
  const svg = select("#svgSpeedChart");
  svg.selectAll("*").remove();
  const graph = svg
    .append("g")
    .attr("id", "svgGroup")
    .attr("transform", "translate(0," + layout.graphMargin.up + ")");
  drawBar(graph, speed, layout, scale);
  drawAxis(graph, layout, scale);
  drawText(graph, layout);
}

function drawText(graph, layout) {
  const { textMargin, divSize, vTextSizeStr } = layout;
  let lText = "Incoming weight / 10mins ";
  const vCorrection = 60;
  const textWeightPos = {
    X: textMargin.left,
    Y: divSize.h / 2 + vCorrection,
  };
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

function drawBar(graph, speed, layout, scale) {
  if (isNaN(speed)) return;
  const { textMargin, axisMargin, blockMargin, graphMargin, barWidth } = layout;
  graph
    .append("g")
    .attr("id", "speedGraphGroup")
    .attr(
      "transform",
      "translate(" +
        (textMargin.left + axisMargin.left + blockMargin.left) +
        ",0)"
    )
    .selectAll("rect")
    .data([speed])
    .enter()
    .append("rect")
    .attr("x", "0")
    .attr("y", (e) => scale(e))
    .attr("width", barWidth)
    .attr(
      "height",
      (e) => layout.svgSize.h - graphMargin.up - axisMargin.up - scale(e)
    )
    .attr("fill", colorize);
}

function colorize(weight) {
  if (weight < avgSpeed) return "lightGreen";
  return "red";
}

function drawAxis(graph, layout, scale) {
  const { textMargin, axisMargin } = layout;
  const axis = axisLeft().scale(scale).tickFormat(format("~s"));
  graph
    .append("g")
    .attr("id", "leftAxisSpeed")
    .attr(
      "transform",
      "translate(" + (textMargin.left + axisMargin.left) + ",0)"
    )
    .call(axis);
}
