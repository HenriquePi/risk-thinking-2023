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

export default function getDecades(data: RiskData[]) {
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