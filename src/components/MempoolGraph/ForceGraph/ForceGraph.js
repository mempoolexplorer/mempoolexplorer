import React, { useEffect } from "react";
import {
  forceLink,
  forceSimulation,
  forceManyBody,
  forceCenter,
} from "d3-force";
import { drag } from "d3-drag";
import { select, selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import { timeout } from "d3-timer";
import { useWindowSize } from "../../../hooks/windowSize";
import "./ForceGraph.css";

const clone = require("rfdc")();

const nodeRadius = 15;
const nodeStrokeWidth = 3;

export function ForceGraph(props) {
  const cData = clone(props.data); //never change incoming data
  processData(cData);

  const size = useWindowSize();
  const layout = createLayout(cData, size);

  const scaleColor = scaleLinear()
    .interpolate(interpolateHcl)
    .domain([cData.minSatVByte, cData.maxSatVByte])
    .range(["LightGreen", "red"]);

  //UseEffect Hook
  useEffect(() => {
    const sim = dataViz(layout, scaleColor, cData, props.interactive);
    return function stop() {
      sim.stop();
    };
  });

  return (
    !isNaN(layout.divSize.Y) &&
    !isNaN(layout.divSize.X) && (
      <div
        className="divForceGraph"
        width={layout.divSize.X}
        height={layout.divSize.Y}
      >
        <svg
          id="svgForceGraph"
          width={layout.svgSize.X}
          height={layout.svgSize.Y}
        ></svg>
      </div>
    )
  );
}

function createLayout(cData, size) {
  let height = nodeRadius * 3;

  const scaleGravity = scaleLinear()
    .domain([1, 100])
    .range([400, 40])
    .clamp(true);

  const numNodes = cData.nodes.length;
  let gravityForce = scaleGravity(numNodes);

  if (numNodes > 2) {
    let multiplier = Math.sqrt(numNodes) / Math.sqrt(200);
    multiplier = Math.min(1, multiplier);
    height = size.height * multiplier + 100;
    height = Math.min(size.height, height);
    height = Math.floor(height);
  }

  const margins = { horizontal: 100, vertical: 0 };

  const additional = { gravityForce: gravityForce };

  const sizes = {
    divSize: { X: size.width - margins.horizontal, Y: height },
    svgSize: { X: size.width - margins.horizontal, Y: height },
  };

  const layout = { ...margins, ...sizes, ...additional };
  return layout;
}

function dataViz(layout, scaleColor, cData, interactive) {
  const { nodes, edges, edgeOriginFn, edgeDestinationFn } = cData;
  const { width, height } = layout.svgSize;
  edges.forEach((edge) => {
    //edge.weight = parseInt(edge.weight);
    edge.source = nodes[edgeOriginFn(edge)];
    edge.target = nodes[edgeDestinationFn(edge)];
  });

  select("#svgForceGraph").selectAll("*").remove();

  const infobox = select("#InfoboxForceGraph");
  if (!infobox.empty()) {
    infobox.remove();
  }

  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-layout.gravityForce))
    .force("link", forceLink(edges))
    .force("bounds", boxingForce)
    .force(
      "center",
      forceCenter()
        .x(layout.svgSize.X / 2)
        .y(layout.svgSize.Y / 2)
    );

  if (interactive === true) {
    simulation.on("tick", tick);
    drawGraph();
  } else {
    simulation.stop();

    timeout(() => {
      // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
      for (
        var i = 0,
          n = Math.ceil(
            Math.log(simulation.alphaMin()) /
              Math.log(1 - simulation.alphaDecay())
          );
        i < n;
        ++i
      ) {
        simulation.tick();
      }
      drawGraph();
    });
  }

  return simulation;

  function drawGraph() {
    const lineGroup = select("#svgForceGraph")
      .selectAll("line.link")
      .data(edges)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "black")
      .style("stroke-width", 1);
    if (interactive === false) {
      lineGroup
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    }
    const nodeGroup = select("#svgForceGraph")
      .selectAll("g.node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node");
    if (interactive === false) {
      nodeGroup.attr("transform", (n) => `translate(${n.x},${n.y})`);
    }

    nodeGroup
      .append("circle")
      .attr("r", nodeRadius)
      .style("fill", (n) => scaleColor(n.satVByte))
      .style("stroke-width", nodeStrokeWidth)
      .style("stroke-dasharray", (n) =>
        n.bip125Replaceable === true ? "6,6" : "none"
      )
      .style("stroke", (n) =>
        n.isSelected === true ? "DarkSlateGray" : "lightGrey"
      )
      //      .on("click", elementClickToSelect)
      .on("click", elementClick)
      .on("mouseover", mouseOver)
      .on("mouseout", mouseOut)
      .on("mousemove", mouseMove);

    if (interactive === true) {
      nodeGroup.call(myDrag(simulation));
    }

    nodeGroup
      .append("text")
      .style("text-anchor", "middle")
      .style("font-size", 9)
      .style("pointer-events", "none")
      .attr("y", 3)
      .text((n) => n.txId.substr(0, 4));

    select("#svgForceGraph")
      .append("defs")
      .append("marker")
      .attr("id", "triangle")
      .attr("refX", nodeRadius + nodeStrokeWidth + 12)
      .attr("refY", 6)
      .attr("markerUnits", "userSpaceOnUse")
      .attr("markerWidth", 12)
      .attr("markerHeight", 18)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6");

    select("#svgForceGraph")
      .selectAll("line.link")
      .attr("marker-end", "url(#triangle)");
  }

  function myDrag(simulation) {
    function clamp(x, lo, hi) {
      return x < lo ? lo : x > hi ? hi : x;
    }
    function dragstarted(event) {
      select(this).classed("fixed", true);
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width);
      d.fy = clamp(event.y, 0, height);
      simulation.alpha(1).restart();
    }
    return drag().on("start", dragstarted).on("drag", dragged);
  }

  function boxingForce() {
    const totalRadius = nodeRadius + nodeStrokeWidth;

    for (let n of nodes) {
      n.x = Math.max(
        totalRadius,
        Math.min(layout.svgSize.X - totalRadius, n.x)
      );
      n.y = Math.max(
        totalRadius,
        Math.min(layout.svgSize.Y - totalRadius, n.y)
      );
    }
  }

  function tick() {
    select("#svgForceGraph")
      .selectAll("g.node")
      .attr("transform", (n) => `translate(${n.x},${n.y})`);

    select("#svgForceGraph")
      .selectAll("line.link")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
  }

  function elementClick(event, d) {
    if (interactive === true) {
      delete d.fx;
      delete d.fy;
      select(this).classed("fixed", false);
      simulation.alpha(1).restart();
    }
    const { fnOnSelected, fnOnSelectedEval } = cData;
    fnOnSelected(fnOnSelectedEval(d));

    const infobox = select("#InfoboxForceGraph");
    if (!infobox.empty()) {
      infobox.remove();
    }
  }

  function mouseOver(event, datum) {
    const { htmlTip, htmlTipData } = cData;
    select(this).style("fill", "grey");

    if (select("#InfoboxForceGraph").empty()) {
      select("body")
        .append("div")
        .attr("id", "InfoboxForceGraph")
        .html(htmlTip)
        .style("position", "fixed")
        .style("z-index", "1")
        .style("background", "lightgrey")
        .style("border", "1px black solid")
        .style("border-radius", "10px")
        .style("pointer-events", "none")
        .style("left", event.clientX + 10 + "px")
        .style("top", event.clientY + 10 + "px");

      selectAll("td.FGTipData")
        .data(htmlTipData)
        .html((e) => e(datum));
    }
  }

  function mouseOut(event, datum) {
    select(this).style("fill", (datum) => scaleColor(datum.satVByte));

    const infobox = select("#InfoboxForceGraph");
    if (!infobox.empty()) {
      infobox.remove();
    }
  }

  function mouseMove(event) {
    const infobox = select("#InfoboxForceGraph");
    if (!infobox.empty()) {
      infobox
        .style("left", event.clientX + 10 + "px")
        .style("top", event.clientY + 10 + "px");
    }
  }
}

function processData(cData) {
  const { nodeIdFn } = cData;

  //Change short names in nodes for longer ones and calculate maxminSatVByte
  cData.maxSatVByte = 0;
  cData.minSatVByte = Number.MAX_VALUE;
  const newNodes = [];
  cData.nodes.forEach((n) => {
    const newNode = {};
    newNode.txId = n.i;
    newNode.weight = n.w;
    newNode.baseFee = n.f;
    newNode.timeInMillis = n.t;
    newNode.bip125Replaceable = n.b;
    newNode.containingBlockIndex = n.bi;
    newNode.modifiedSatVByte = n.m;
    newNode.satVByte = newNode.baseFee / (newNode.weight / 4);
    newNode.isSelected = false;
    newNodes.push(newNode);
    cData.maxSatVByte = Math.max(cData.maxSatVByte, newNode.satVByte);
    cData.minSatVByte = Math.min(cData.minSatVByte, newNode.satVByte);
  });
  cData.nodes = newNodes;
  //First node is always the selected one
  cData.nodes[0].isSelected = true;

  //Normalize the graph by ordening nodes by TxId.
  //Edges indexes must be changed acordingly.

  //map oldIndex->txId
  const oldIndexToTxId = cData.nodes.reduce((map, node, index) => {
    map[index] = nodeIdFn(node);
    return map;
  }, {});

  cData.nodes.sort((a, b) => {
    if (a.txId < b.txId) return -1;
    if (a.txId > b.txId) return 1;
    return 0;
  });

  //map txId->new index
  const txIdToNewIndex = cData.nodes.reduce((map, node, index) => {
    map[nodeIdFn(node)] = index;
    return map;
  }, {});

  cData.edges.forEach((edge) => {
    edge.o = txIdToNewIndex[oldIndexToTxId[edge.o]];
    edge.d = txIdToNewIndex[oldIndexToTxId[edge.d]];
  });
}
