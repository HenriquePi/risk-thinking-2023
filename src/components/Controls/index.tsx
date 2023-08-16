import React from "react";
import { RiskContext } from "../../../risk-data/RiskContext";

export const Controls = () => {
  const {
    filteredRiskData, 
    setSelectedDecade, 
    riskFilterType, 
    toggleRiskFactorFilter, 
    riskFactorsList, 
    selectedRiskFactors, 
    updateSelectedRiskFactors,
    locationList,
    selectedLocation,
    setSelectedLocation,
    selectedCategory,
    setSelectedCategory,
    categoryList,
    selectedAsset,
    setSelectedAsset,
    assetList,
    
  } = React.useContext(RiskContext);

  React.useEffect(() => {
    setSelectedLocation(locationList ? locationList[0] : "All");
    setSelectedAsset(assetList ? assetList[0] : "All");
  }, [locationList, categoryList, assetList]);


  return (
    <div className="fixed bottom-0 left-0 right-0 px-24 pt-6 pb-2 bg-white rounded-t">
      {/* Select Decade */}
      <div className="w-full text-black bg-white">
        <select className="w-full" onChange={(event) => setSelectedDecade(parseInt(event.target.value))}>
          <option value={"All"}>All Decades</option>
          {
            filteredRiskData?.decadeRange?.map((range, index) => (
              <option key={`${range}-map-decades`} value={range}>{range}</option>
            ))
          }
        </select>
      </div>
      {/* select location/asset/category */}
      <div className="text-black">
        <select 
          className="w-1/3"
          onChange={(e) => {
            console.log(e.target.value);
            if (e.target.value === "All")
              setSelectedLocation(JSON.parse("All"));
            else
              setSelectedLocation(JSON.parse(e.target.value));
          }}
          value={
            selectedLocation === "All" 
              ? "All" 
              : JSON.stringify(selectedLocation)
          }
        >
            <option value={undefined}>Any Location</option>
          {locationList && locationList.map((location,index) => (
            <option key={`location-dropdown-${location.Lat}-${location.Long}-${index}`} value={JSON.stringify(location)}>Lat:{location.Lat}, Long:{location.Long}</option>
          ))}
        </select>
        <select 
          className="w-1/3"
          onChange={(e) => {
            setSelectedAsset(e.target.value);
          }}
          value={selectedAsset}
        >
          <option value={"All"}>Any Asset</option>
          {assetList && assetList.map((asset) => (
            <option key={`asset-selection-${asset}`} value={asset}>{asset}</option>
          ))}
        </select>
        <select 
          className="w-1/3"
          onChange={(e) => {
            setSelectedCategory(e.target.value);
          }}
          value={selectedCategory}
        >
          <option value={"All"}>Any Category</option>
          {categoryList && categoryList.map((businessCategory) => (
            <option key={`category-selection-${businessCategory}`} value={businessCategory}>{businessCategory}</option>
          ))}
        </select>
      </div>
      {/* select risk factors */}
      <div className='flex justify-between gap-2 pt-4'>
        <button 
          className={`border rounded-full basis-0 grow border-black text-black`}
          onClick={() => {toggleRiskFactorFilter()}}
        >
          {riskFilterType === "CONTAINS" ? 'Only Has Selected Risk' : 'Has Selected Risk'}
        </button>
      </div>
      <div className='flex justify-between gap-2 py-4'>
        {riskFactorsList && riskFactorsList.map((item, index) => (
          <button 
            key={`${item}-filter`} 
            className={`border rounded-full basis-0 grow ${selectedRiskFactors.includes(item) ? 'bg-green-600 text-white border-green-600' : 'bg-white text-red-600 border-red-600'}}`}
            onClick={() => {
              updateSelectedRiskFactors(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>

    </div>
  )
}