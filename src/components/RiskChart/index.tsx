import * as d3 from "d3";
import React from "react";
import { RiskData, RiskDataObject } from "../../../risk-data/RiskDataType";

type props = {
  riskData: RiskDataObject | null;
  decade: number | null;
};

type locations = {
  Lat: string;
  Long: string;
};

type lines = {
  [key: string]: RiskData[],
};

type legend = {
  [key: string]: string,
};

export const RiskChart:React.FC<props> = ({riskData}) => {
  const [locations, setLocations] = React.useState<locations[]>([]);
  const [activeLocation, setActiveLocation] = React.useState<locations | string>("All");
  const [assets, setAssets] = React.useState<string[]>([]);
  const [activeAsset, setActiveAsset] = React.useState<string | null>("All");
  const [businessCategories, setBusinessCategories] = React.useState<string[]>([]);
  const [activeBusinessCategory, setActiveBusinessCategory] = React.useState<string | null>("All");

  const [activeData, setActiveData] = React.useState<RiskData[] | null>(null);
  const [activeLines, setActiveLines] = React.useState<lines | null>(null);
  const [legend, setLegend] = React.useState<legend>({});

  const compileLocations = () => {
    let locations:locations[] = [];
    riskData?.data.forEach((data) => {
      if (!locations.includes({Lat: data.Lat, Long: data.Long})) {
        locations.push({Lat: data.Lat, Long: data.Long});
      }
    });
    setLocations(locations);
  };
  const compileAssets = () => {
    let assets:string[] = [];
    riskData?.data.forEach((data) => {
      if (!assets.includes(data["Asset Name"])) {
        assets.push(data["Asset Name"]);
      }
    });
    setAssets(assets);
  };
  const compileBusinessCategories = () => {
    let businessCategories:string[] = [];
    riskData?.data.forEach((data) => {
      if (!businessCategories.includes(data["Business Category"])) {
        businessCategories.push(data["Business Category"]);
      }
    });
    setBusinessCategories(businessCategories);
  };

  const compileData = () => {
    // filter
    let filteredData = riskData?.data.filter((data) => {
      var isAssetMatch = activeAsset === "All" ? true : data["Asset Name"] === activeAsset;
      var isLocationMatch = activeLocation === "All" ? true : data.Lat === activeLocation?.Lat && data.Long === activeLocation?.Long;
      var isBusinessCategoryMatch = activeBusinessCategory === "All" ? true : data["Business Category"] === activeBusinessCategory;

      return (isAssetMatch && isLocationMatch && isBusinessCategoryMatch);
    });
    // modify date for D3
    var parseDate = d3.timeParse("%Y");
    
    filteredData?.forEach((data) => {
      if (typeof data.Year === "string")
        data.Year = parseDate(data.Year);
    });
    setActiveData(filteredData ? filteredData : null);
  };

  const compileLines = () => {
    let lines:lines = {};
    activeData?.forEach((item) => {
      const key = [item["Asset Name"], item["Business Category"], item.Lat, item.Long].join(' ');
      if (!lines[key])
        lines[key] = [item];
      else
        lines[key] = [...lines[key], item];
    });
    setActiveLines(lines);
  };

  const createGraph = async () => {

    let data = {
      date: riskData?.decadeRange,
      value: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };
    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;    
    // append the svg object to the graph element of the page
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
  React.useEffect(() => {
    if (riskData) {
      compileLocations();
      compileAssets();
      compileBusinessCategories();
    }
  }, [riskData]);

  React.useEffect(() => {
    console.log("active location", activeLocation, "active asset", activeAsset, "active business category", activeBusinessCategory)
    compileData();
  }, [activeLocation, activeAsset, activeBusinessCategory]);

  React.useEffect(() => {
    if (activeData) {
      compileLines();
    }
  }, [activeData]);

  React.useEffect(() => {
    if (activeLines) {
      console.log(activeLines);
      createGraph();
    }
  }, [activeLines]);

  return (
    <div>
      <div className="text-black">
        <select 
          className="w-1/3"
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value === "All")
              setActiveLocation("All");
            else
              setActiveLocation(JSON.parse(e.target.value));
          }}
          value={
            activeLocation === "All" 
              ? "All" 
              : JSON.stringify(activeLocation)
          }
        >
            <option value={undefined}>Any Location</option>
          {locations && locations.map((location,index) => (
            <option key={`location-dropdown-${location.Lat}-${location.Long}-${index}`} value={JSON.stringify(location)}>Lat:{location.Lat}, Long:{location.Long}</option>
          ))}
        </select>
        <select 
          className="w-1/3"
          onChange={(e) => {
            setActiveAsset(e.target.value);
          }}
          value={activeAsset}
        >
          <option value={undefined}>Any Asset</option>
          {assets && assets.map((asset) => (
            <option value={asset}>{asset}</option>
          ))}
        </select>
        <select 
          className="w-1/3"
          onChange={(e) => {
            setActiveBusinessCategory(e.target.value);
          }}
          value={activeBusinessCategory}
        >
          <option value={undefined}>Any Category</option>
          {businessCategories && businessCategories.map((businessCategory) => (
            <option value={businessCategory}>{businessCategory}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col xl:flex-row xl:justify-between">
        <div id="risk-graph" className="mx-auto"/>
        <div id="legend" className="p-3 m-5 mx-auto border border-white rounded w-fit">
          <h2>Legend</h2>
          {legend && Object.entries(legend).map(([key, value]) => (
            <div key={key}>
              <div>
                <div style={{color: value}}>{key}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}