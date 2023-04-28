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

export const RiskChart:React.FC<props> = ({riskData, decade }) => {
  const [locations, setLocations] = React.useState<locations[]>([]);
  const [activeLocation, setActiveLocation] = React.useState<locations | null>(null);
  const [assets, setAssets] = React.useState<string[]>([]);
  const [activeAsset, setActiveAsset] = React.useState<string | null>(null);
  const [businessCategories, setBusinessCategories] = React.useState<string[]>([]);
  const [activeBusinessCategory, setActiveBusinessCategory] = React.useState<string | null>(null);

  const [activeData, setActiveData] = React.useState<RiskData[] | null>(null);

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
    let filter = activeAsset ? activeAsset : activeLocation ? activeLocation : activeBusinessCategory ? activeBusinessCategory : null;
    // filter
    let filteredData = riskData?.data.filter((data) => {
      if (activeAsset) {
        return data["Asset Name"] === activeAsset;
      } else if (activeLocation) {
        return data.Lat === activeLocation.Lat && data.Long === activeLocation.Long;
      } else if (activeBusinessCategory) {
        return data["Business Category"] === activeBusinessCategory;
      } else {
        return true;
      }
    });
    // modify date for D3
    var parseDate = d3.timeParse("%Y");
    
    filteredData?.forEach((data) => {
      if (typeof data.Year === "string")
        data.Year = parseDate(data.Year);
    });

    console.log(filteredData);
    // return filteredData;
    setActiveData(filteredData ? filteredData : null);
  };


  const createGraph = async () => {

    let data = {
      date: riskData?.decadeRange,
      value: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;    // append the svg object to the body of the page
    if (d3.select("#risk-graph").select("svg")._groups[0][0]) {
      console.log("svg exists", d3.select("#risk-graph").select("svg"));
      d3.select("#risk-graph").select("svg").remove();
    }
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

    // add the Line
    var valueLine = d3.line()
    .x((d) => { return x(activeData.Year); })
    .y((d) => { return y(activeData["Risk Rating"]); });   
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine)
  }   
  React.useEffect(() => {
    // createGraph();
    if (riskData) {
      compileLocations();
      compileAssets();
      compileBusinessCategories();
    }
  }, [riskData]);

  React.useEffect(() => {
    compileData();
  }, [activeLocation, activeAsset, activeBusinessCategory]);

  React.useEffect(() => {
    if (activeData) {
      createGraph();
    }
  }, [activeData]);

  return (
    <div>
      <div className="text-black">
        <select 
          onChange={(e) => {
            setActiveLocation(e.target.value);
            setActiveAsset(undefined);
            setActiveBusinessCategory(undefined);
          }}
          value={activeLocation}
        >
            <option value={undefined}>All</option>
          {locations && locations.map((location) => (
            <option value={location}>Lat:{location.Lat}, Long:{location.Long}</option>
          ))}
        </select>
        <select 
          onChange={(e) => {
            setActiveAsset(e.target.value);
            setActiveLocation(undefined);
            setActiveBusinessCategory(undefined);
          }}
          value={activeAsset}
        >
          <option value={undefined}>All</option>
          {assets && assets.map((asset) => (
            <option value={asset}>{asset}</option>
          ))}
        </select>
        <select 
          onChange={(e) => {
            setActiveBusinessCategory(e.target.value);
            setActiveLocation(undefined);
            setActiveAsset(undefined);  
          }}
          value={activeBusinessCategory}
        >
          <option value={undefined}>All</option>
          {businessCategories && businessCategories.map((businessCategory) => (
            <option value={businessCategory}>{businessCategory}</option>
          ))}
        </select>
      </div>
      <div id="risk-graph"/>
    </div>
  );
}