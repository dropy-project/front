import React, { useEffect, useState } from 'react';
import { Circle, Polygon } from 'react-native-maps';
import Geohash from 'ngeohash';
import { GEOHASH_SIZE } from '../states/GeolocationContextProvider';

const MapDebugger = ({ userCoordinates }) => {
  const [debugPolygons, setDebugPolygons] = useState([]);

  useEffect(() => {
    if (!userCoordinates)
      return;

    const polygons = [];
    for (const chunkInt of userCoordinates.geoHashs) {
      const [minlat, minlon, maxlat, maxlon] = Geohash.decode_bbox_int(chunkInt, GEOHASH_SIZE);
      polygons.push([{ latitude: minlat, longitude: minlon }, { latitude: maxlat, longitude: minlon }, { latitude: maxlat, longitude: maxlon }, { latitude: minlat, longitude: maxlon }]);
    }

    setDebugPolygons(polygons);
  }, [userCoordinates]);

  return (
    <>
      {debugPolygons.map((polygon, index) => (
        <React.Fragment key={index}>
          <Polygon
            coordinates={polygon}
            strokeColor='rgba(0,0,255,0.9)'
            fillColor='rgba(100,0,255,0.2)'
            strokeWidth={1}
          />
        </React.Fragment>
      ))}
      <Circle
        center={{
          latitude: userCoordinates?.latitude || 0,
          longitude: userCoordinates?.longitude || 0,
        }}
        radius={30}
      >
      </Circle>
    </>
  );
};

export default MapDebugger;
