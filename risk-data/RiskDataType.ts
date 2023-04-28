export type RiskData = {
  "Asset Name": string,
  "Business Category": string,
  "Risk Factors": {
    [key: string]: number,
  },
  "Risk Rating": string,
  Year: string | Date | null,
  Lat: string,
  Long: string,
}
export type RiskDataObject = {
  data: RiskData[],
  decadeRange: number[],
}
