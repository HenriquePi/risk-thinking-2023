'use client'
import axios from "axios";
import React from "react";
import { createContext } from "react";
import { locations, RiskData, RiskDataObject } from "./RiskDataType";

type ContextType = {
  riskData: RiskDataObject | null;

  filteredRiskData: RiskDataObject | null;

  selectedDecade: number | string | null;
  setSelectedDecade: (decade: number | string) => void;

  selectedLocation: locations | "All";
  setSelectedLocation: (location: locations | "All") => void;
  locationList: locations[] | null;

  selectedCategory: string | "All";
  setSelectedCategory: (category: string) => void;
  categoryList: string[] | null;

  selectedAsset: string | "All";
  setSelectedAsset: (asset: string) => void;
  assetList: string[] | null;

  selectedRiskFactors: string[];
  riskFactorsList: string[] | null;
  riskFilterType: "CONTAINS" | "ONLY";
  toggleRiskFactorFilter: () => void;
  updateSelectedRiskFactors: (riskFactor: string) => void;
}

export const RiskContext = createContext<ContextType>({
  riskData: null,
  filteredRiskData: null,
  selectedDecade: null,
  setSelectedDecade: () => {},
  selectedLocation: "All",
  setSelectedLocation: () => {},
  locationList: [],
  selectedCategory: "All",
  setSelectedCategory: () => {},
  categoryList: [],
  selectedAsset: "All",
  setSelectedAsset: () => {},
  assetList: [],
  riskFactorsList: [],
  selectedRiskFactors: [],
  riskFilterType: "CONTAINS",
  toggleRiskFactorFilter: () => {},
  updateSelectedRiskFactors: () => {},
})

const compileLocations = (riskData: RiskData[]) => {
  let locations:locations[] = [];
  riskData.forEach((data) => {
    if (!locations.includes({Lat: data.Lat, Long: data.Long})) {
      locations.push({Lat: data.Lat, Long: data.Long});
    }
  });
  return locations;
};
const compileAssets = (riskData: RiskData[]) => {
  let assets:string[] = [];
  riskData.forEach((data) => {
    if (!assets.includes(data["Asset Name"])) {
      assets.push(data["Asset Name"]);
    }
  });
  return assets;
};
const compileBusinessCategories = (riskData: RiskData[]) => {
  let businessCategories:string[] = [];
  riskData.forEach((data) => {
    if (!businessCategories.includes(data["Business Category"])) {
      businessCategories.push(data["Business Category"]);
    }
  });
  return businessCategories;
};

const compileRiskFactors = (riskData: RiskData[]) => {
  // could be optimized
  let filters: string[] = [];
  if (riskData) {
    riskData.forEach((item) => {
      Object.entries(JSON.parse(item["Risk Factors"] as string)).map(([key, value]) => {
        if (!filters.includes(key)) {
          filters.push(key);
        }
      })
    })
  }
  return filters;
};

const filterContainsSelectedRiskFactors = (riskData: RiskData[], activeFilters: string[]) => {
  let filtering = JSON.parse(JSON.stringify(riskData));
  if (activeFilters.length > 0) {
    let filteredData = filtering.filter((item:RiskData) => {
      let riskFactors = JSON.parse(item["Risk Factors"] as string);
      return activeFilters.every((filter) => riskFactors.hasOwnProperty(filter))
    })
    console.log("filter contains function", filteredData);
    return filteredData;
  } else {
    console.log("filter contains function norun", filtering);
    return filtering;
  }

}
const filterOnlySelectedRiskFactors = (riskData: RiskData[], activeFilters: string[]) => {
  let filtering = JSON.parse(JSON.stringify(riskData));
  if (activeFilters.length > 0) {
    let filteredData = filtering.filter((item:RiskData) => {
      let riskFactors = JSON.parse(item["Risk Factors"] as string);
      
      const hasAllActiveFilters = activeFilters.every((filter) => riskFactors.hasOwnProperty(filter));
      const hasNoExtraProperties = Object.keys(riskFactors).length === activeFilters.length;

      return hasAllActiveFilters && hasNoExtraProperties;
    });
    console.log("filter contains function", filteredData);
    return filteredData;
  } else {
    console.log("filter contains function norun", filtering);
    return filtering;
  }
};


type Props = {
  children?: React.ReactNode
};
export const RiskContextProvider:React.FC<Props> = ({children}) => {
  const [riskData, setRiskData] = React.useState<RiskDataObject| null>(null);
  const [filteredRiskData, setFilteredRiskData] = React.useState<RiskDataObject| null>(null);

  const [selectedDecade, setSelectedDecade] = React.useState<number | string>("All");

  const [selectedLocation, setSelectedLocation] = React.useState<locations | "All">("All");
  const [locationList, setLocationList] = React.useState<locations[] | null>(null);

  const [selectedCategory, setSelectedCategory] = React.useState<string | "All">("All");
  const [categoryList, setCategoryList] = React.useState<string[] | null>(null);

  const [selectedAsset, setSelectedAsset] = React.useState<string | "All">("All");
  const [assetList, setAssetList] = React.useState<string[] | null>(null);

  const [selectedRiskFactors, setSelectedRiskFactors] = React.useState<string[]>([]);
  const [riskFactorsList, setRiskFactorsList] = React.useState<string[] | null>(null);
  const [riskFilterType, setRiskFilterType] = React.useState<"CONTAINS" | "ONLY">("CONTAINS");

  // get data
  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/riskdata`);
      setRiskData(res.data);
    };
    fetchData();
  }, []);
  // compile filters
  React.useEffect(() => {
    if (riskData) {
      setLocationList(compileLocations(riskData.data));
      setCategoryList(compileBusinessCategories(riskData.data));
      setAssetList(compileAssets(riskData.data));
      setRiskFactorsList(compileRiskFactors(riskData.data));
    }
  }, [riskData]);
  // filter data
  React.useEffect(() => {
    if (riskData) {
      // deep copy
      let filteredData = JSON.parse(JSON.stringify(riskData.data));
      // filter by decade
      if (selectedDecade !== "All") {
        filteredData = filteredData.filter((data:RiskData) => {
          return data["Year"] === `${selectedDecade}`;
        });
      }
      // filter by location
      if (selectedLocation !== "All") {
        filteredData = filteredData.filter((data: RiskData) => {
          return data["Lat"] === selectedLocation.Lat && data["Long"] === selectedLocation.Long;
        });
      }
      // filter by category
      if (selectedCategory !== "All") {
        filteredData = filteredData.filter((data: RiskData) => {
          return data["Business Category"] === selectedCategory;  
        });
      }
      // filter by asset
      if (selectedAsset !== "All") {
        filteredData = filteredData.filter((data: RiskData) => {
          return data["Asset Name"] === selectedAsset;
        });
      }
      // filter by risk factors
      if (riskFilterType === "CONTAINS") {
        filteredData = filterContainsSelectedRiskFactors(filteredData, selectedRiskFactors);
      } else if (riskFilterType === "ONLY") {
        filteredData = filterOnlySelectedRiskFactors(filteredData, selectedRiskFactors);
      }
      console.log("post filter", riskFilterType, filteredData);
      setFilteredRiskData({decadeRange: riskData.decadeRange, data: filteredData});
    }
  }, [riskData, selectedDecade, selectedLocation, selectedCategory, selectedAsset, selectedRiskFactors, riskFilterType]);

  React.useEffect(() => {
    console.log("filtered data", filteredRiskData);
  }, [filteredRiskData]);


  const toggleRiskFactorFilter = () => {
    console.log("toggle risk factor filter");
    if (riskFilterType === "CONTAINS") {
      console.log("setting to only");
      setRiskFilterType("ONLY");
    } else if (riskFilterType === "ONLY") {
      console.log("setting to contains");
      setRiskFilterType("CONTAINS");
    }
  }

  const updateSelectedRiskFactors = (riskFactor: string) => {
    let newSelectedRiskFactors = [...selectedRiskFactors];
    if (newSelectedRiskFactors.includes(riskFactor)) {
      newSelectedRiskFactors = newSelectedRiskFactors.filter((item) => item !== riskFactor);
    } else {
      newSelectedRiskFactors.push(riskFactor);
    }
    setSelectedRiskFactors(newSelectedRiskFactors);
  }



    return (
      <RiskContext.Provider value={{
        riskData,
        filteredRiskData,
        selectedDecade,
        setSelectedDecade,
        selectedLocation,
        setSelectedLocation,
        locationList,
        selectedCategory,
        setSelectedCategory,
        categoryList,
        selectedAsset,
        setSelectedAsset,
        assetList,
        riskFactorsList,
        selectedRiskFactors,
        riskFilterType,
        toggleRiskFactorFilter,
        updateSelectedRiskFactors,
      }}>
        {children}
      </RiskContext.Provider>
    )
  } 