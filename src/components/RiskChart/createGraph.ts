// @ts-nocheck
import * as d3 from "d3";
import { legend, lines, RiskData } from "../../../risk-data";

export default function createGraph (activeData: RiskData[] | null, activeLines:lines, setLegend: ({}: {}) => void) {

  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 30, left: 30 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;    
  // append the svg object to the graph element of the page
  //@ts-ignore
  if (d3.select("#risk-graph").select("svg")._groups[0][0]) {
    // remove existing graph
    d3.select("#risk-graph").select("svg").remove();
  }
  // add tooltip
  const tooltip = d3.select("#risk-graph")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("color", "black")
    .style("padding", "5px")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("pointer-events", "none");

  var svg = d3.select("#risk-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},     ${margin.top})`);

  // Add X axis and Y axis
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);   
  x.domain(d3.extent(activeData, (d) => { return d.Year; }));
  y.domain([0, d3.max(activeData, (d) => { return d["Risk Rating"]; })]);   
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));   
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add X axis label:
  svg.append("text")
  .attr("class", "x label text-white")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height - 6)
  .style("fill", "white")
  .text("Decades (years)");

  // Add Y axis label:
  svg.append("text")
  .attr("class", "y label")
  .attr("text-anchor", "end")
  .attr("y", 6)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .style("fill", "white")
  .text("Risk Rating");



  // add the Line
  activeData?.sort((a, b) => {
    return (a.Year - b.Year);
  });

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  let legendData:legend = {};

  Object.entries(activeLines).forEach(([key, value], index) => {
    var colour = colorScale(index.toString());
    legendData[key] = colour;
    if (value.length > 1) {
      var valueLine = d3.line()
      .x((d) => { return x(d.Year); })
      .y((d) => { return y(d["Risk Rating"]); });   
      svg.append("path")
        .data([value])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", colour)
        .attr("stroke-width", 1.5)
        .on("mouseover", function () { // Use the .on() method to attach the mouseover event listener
          d3.select(this)
            .style("stroke-width", "5px");
        })
        .on("mouseout", function () { // Use the .on() method to attach the mouseout event listener
          d3.select(this)
            .style("stroke-width", "1.5px");
        })
        .attr("d", valueLine)
        .style("cursor", "pointer") // Set the cursor to a pointer
    }
    value.forEach((item) => {
      svg.append("circle")
        .attr("cx", x(item.Year))
        .attr("cy", y(item["Risk Rating"]))
        .attr("r", 3)
        .on("mouseover", function (event, d) {
          tooltip.style("opacity", 1);
          d3.select(this).attr("r", 5);
        })
        .on("mousemove", function (event, d) {
          tooltip
            .html(`
              Asset Name:${item["Asset Name"]} <br/>
              Year: ${(item.Year as Date).getFullYear()}<br/>
              Risk Rating: ${item["Risk Rating"]}<br/>
              Risk Factors:<br/>${
                Object.entries(JSON.parse(item["Risk Factors"])).map(([key, value]) => (`${key}: ${value}<br/>`))}
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function (event, d) {
          tooltip.style("opacity", 0);
          d3.select(this).attr("r", 3)
        })
        .style("fill", colour)
        .style("cursor", "pointer") // Set the cursor to a pointer
      });
    
  });
  setLegend(legendData);
}  