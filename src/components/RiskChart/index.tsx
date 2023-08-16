import * as d3 from "d3";
import React from "react";
import { RiskContext } from "../../../risk-data/RiskContext";
import { legend, lines, locations, RiskData, RiskDataObject } from "../../../risk-data/RiskDataType";
import createGraph from "./createGraph";

export const RiskChart:React.FC = () => {

  const { 
    selectedAsset, 
    assetList, 
    setSelectedAsset,
    locationList, 
    selectedLocation, 
    setSelectedLocation,
    categoryList, 
    selectedCategory,
    setSelectedCategory,
    riskFilterType,
    selectedRiskFactors,
    filteredRiskData 
  } = React.useContext(RiskContext);

  const [activeData, setActiveData] = React.useState<RiskData[] | null>(null);
  const [activeLines, setActiveLines] = React.useState<lines | null>(null);
  const [legend, setLegend] = React.useState<legend>({});
  const [showMore, setShowMore] = React.useState<boolean>(false);

  const compileData = () => {
    // modify date for D3
    var parseDate = d3.timeParse("%Y");
    if (filteredRiskData?.data){
      let createActiveData = JSON.parse(JSON.stringify(filteredRiskData?.data));
      createActiveData?.forEach((data: RiskData) => {
        if (typeof data.Year === "string")
          data.Year = parseDate(data.Year);
      });
      setActiveData(createActiveData ? createActiveData : activeData);
    }
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

  

  React.useEffect(() => {
    compileData();
  }, [selectedAsset, selectedLocation, selectedRiskFactors, filteredRiskData]);

  React.useEffect(() => {
    if (activeData) {
      compileLines();
    }
  }, [activeData]);

  React.useEffect(() => {
    if (activeLines) {
      createGraph(activeData, activeLines, setLegend);
    }
  }, [activeLines]);

  React.useEffect(() => {
    if (legend) {
      console.log("legend", legend, legend.length, );
    }
  }, [legend]);

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:justify-between">
        <div id="risk-graph" className="mx-auto"/>
        <div id="legend" className={`relative p-3 pb-[24px] m-5 mx-auto border border-white rounded w-fit ${(Object.keys(legend).length > 15) ? "max-h-[500px] overflow-y-scroll" : ""}`}>
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