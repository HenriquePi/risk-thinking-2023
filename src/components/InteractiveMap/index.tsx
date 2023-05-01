import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { RiskData, RiskDataObject } from '../../../risk-data/RiskDataType';

const containerStyle = {
  width: '100%',
  aspectRatio: 2
};

const center = {
  lat: 46.1351,
  lng: -60.1831
};

type props = {
  riskData: RiskDataObject | null,
  selectDecade: (decade: number) => void,
}

const Map:React.FC<props> = ({riskData, selectDecade}) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAF_90BYDMzxc5EdC_Sg8ZR1-2vnZ9T4fM"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const riskColour = (risk: number) => {
    if (risk < 0.25) {
      return 'green';
    } else if (risk < 0.5) {
      return 'yellow';
    } else if (risk < 0.75) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  // TODO modularize modal
  const [modal, setModal] = React.useState(false);
  const [modalData, setModalData] = React.useState<RiskData | null>(null);

  return isLoaded ? (
    <div className="flex flex-col">
      <div className="w-full text-black bg-white">
        <select className="w-full" onChange={(event) => selectDecade(parseInt(event.target.value))}>
          <option value={"All"}>All Decades</option>
          {
            riskData?.decadeRange?.map((range, index) => (
              <option key={`${range}-map-decades`} value={range}>{range}</option>
            ))
          }
        </select>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={1}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>
          {
            // index should not be used as a key, but the data has duplicates and no UUID
            riskData?.data.map((item,index) => (
              <Marker 
              icon={{
                path:
                  "M68.51,106.28c-5.59,6.13-12.1,11.62-19.41,16.06c-0.9,0.66-2.12,0.74-3.12,0.1 c-10.8-6.87-19.87-15.12-27-24.09C9.14,86.01,2.95,72.33,0.83,59.15c-2.16-13.36-0.14-26.22,6.51-36.67 c2.62-4.13,5.97-7.89,10.05-11.14C26.77,3.87,37.48-0.08,48.16,0c10.28,0.08,20.43,3.91,29.2,11.92c3.08,2.8,5.67,6.01,7.79,9.49 c7.15,11.78,8.69,26.8,5.55,42.02c-3.1,15.04-10.8,30.32-22.19,42.82V106.28L68.51,106.28z M46.12,23.76 c12.68,0,22.95,10.28,22.95,22.95c0,12.68-10.28,22.95-22.95,22.95c-12.68,0-22.95-10.27-22.95-22.95 C23.16,34.03,33.44,23.76,46.12,23.76L46.12,23.76z",
                fillColor: riskColour(parseFloat(item["Risk Rating"])),
                fillOpacity: 0.9,
                scale: 0.2,
                strokeColor: "black",
                strokeWeight: 2,
              }}
                key={`
                  marker-${item['Asset Name']}-${item['Business Category']}-${item.Year}-${index}
                `} 
                position={{lat: parseInt(item.Lat), lng: parseInt(item.Long)}} 
                title={`${item['Asset Name']} - ${item["Business Category"]}`}
                onClick={() => {
                  setModal(true);
                  setModalData(item);
                }}
                visible
              />
            ))
          }
        </>
      </GoogleMap>
      {(modal && modalData) &&
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" 
          onClick={() => {
            setModal(false);
            setModalData(null);
          }}
        >
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
            <div className="w-[90%] bg-gray-200 p-3">
              <div className="">
                {Object.entries(modalData).map((item, index) => (
                  <div key={`modal-${index}`} className="w-full h-1/2">
                    <div className='text-black'>{
                      item[0] === "Risk Factors" 
                      ?
                        <>
                          <p>{`${item[0]}:`}</p>
                          {Object.entries(JSON.parse(item[1] as string)).map((item, index) => {
                            return <p className="ml-5" key={`risk-factors-${item[0]}-${item[1]}`}>{`${item[0]}: ${item[1]}`}</p>
                          })}
                        </>
                      :
                        <p>{`${item[0]}: ${item[1]}`}</p>
                    }</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }



      </div>
  ) : <></>
};

export const InteractiveMap = React.memo(Map)