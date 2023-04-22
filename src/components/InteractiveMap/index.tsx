import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { RiskData, RiskDataObject } from '../../../risk-data/RiskDataType';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

type props = {
  data: RiskDataObject | null,
  selectDecade: (decade: number) => void,
}

const Map:React.FC<props> = ({data, selectDecade}) => {

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


  return isLoaded ? (
    <div className="flex flex-col">
      <div className="w-full text-black bg-white">
        <select className="w-full" onChange={(event) => selectDecade(parseInt(event.target.value))}>
          {
            data?.decadeRange?.map((range, index) => (
              <option key={`${range}-map-decades`} value={range}>{range}</option>
            ))
          }
        </select>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>
          
        </>
      </GoogleMap>
    </div>
  ) : <></>
};

export const InteractiveMap = React.memo(Map)