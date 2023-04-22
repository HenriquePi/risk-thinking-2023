import Papa, { ParseResult } from "papaparse"
import fs from 'fs';

export async function GET(request: Request) {

  const SampleData = fs.readFileSync('./public/SampleData.csv', 'utf8');

  const parsedData = Papa.parse(SampleData, {
    header: true,
    skipEmptyLines: true,
  }).data;

  const dataString = JSON.stringify(parsedData);

  return new Response(dataString)
}
