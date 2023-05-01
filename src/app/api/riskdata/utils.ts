import Papa, { ParseResult } from "papaparse"
import fs from 'fs';
import { RiskData } from "../../../../risk-data";

export const getCSVData = async (path: string) => {
  const SampleData = fs.readFileSync(path, 'utf8');

  const parsedData = Papa.parse(SampleData, {
    header: true,
    skipEmptyLines: true,
  }).data;
  // type issue here, fix hack
  const dataString:RiskData[] = JSON.parse(JSON.stringify(parsedData));

  return dataString;
};

export function getDecades(data: RiskData[]) {
  const highestYear = data.reduce((acc, curr) => {
    return Math.max(acc, parseInt(curr.Year));
  }, 0);

  const lowestYear = data.reduce((acc, curr) => {
    return Math.min(acc, parseInt(curr.Year));
  }
  , highestYear);

  const lowestDecade = Math.floor(lowestYear / 10) * 10;
  const highestDecade = Math.ceil(highestYear / 10) * 10;
  const decades = [];
  for (let i = lowestDecade; i <= highestDecade; i += 10) {

    decades.push(i);
  }
  return decades;
}

type RiskHash = {
  [key: string]: RiskData,
}

type KeyObject = {
  [key: string]: number,
}


export function aggregate (data:RiskData[]) {
  let hash:RiskHash = {};
  
  //parse Risk Factors to JSON
  data.forEach((item) => {
    item["Risk Factors"] = JSON.parse(item["Risk Factors"] as string);
  });

  data.forEach((item) => {
    const key = [item["Asset Name"], item["Business Category"], item.Lat, item.Long, item.Year ].join('-');
    hash[key] = {...hash[key], ...item, "Risk Factors": {...hash[key]?.["Risk Factors"] as KeyObject, ...item["Risk Factors"] as KeyObject}};
  });
  // sum risk factors and set as new risk rating
  Object.keys(hash).forEach((key) => {
    // @ts-ignore
    const riskFactors:KeyObject = hash[key]["Risk Factors"];
    const sum = Object.keys(riskFactors).reduce((acc, curr) => {
      return acc + riskFactors[curr];
    }, 0);
    hash[key]["Risk Rating"] = sum.toString();
  });
  //convert hash to array
  const aggregateData = Object.keys(hash).map((key) => {
    return hash[key];
  });
  // convert risk data to string
  aggregateData.forEach((item) => {
    item["Risk Factors"] = JSON.stringify(item["Risk Factors"]);
  });
  return aggregateData;
}