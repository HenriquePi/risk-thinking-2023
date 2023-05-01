export type RiskData = {
  "Asset Name": string,
  "Business Category": string,
  "Risk Factors": {
    [key: string]: number,
  } | string,
  "Risk Rating": string,
  Year: string | Date | null,
  Lat: string,
  Long: string,
};

export type RiskDataObject = {
  data: RiskData[],
  decadeRange: number[],
};

export type locations = {
  Lat: string;
  Long: string;
};

export type lines = {
  [key: string]: RiskData[],
};

export type legend = {
  [key: string]: string,
};
