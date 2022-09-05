import React, { createContext, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import CompassHeading from 'react-native-compass-heading';
import Geohash from 'ngeohash';

import usePermissions from '../hooks/usePermissions';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import GeolocationModal from '../components/overlays/GeolocationModal';

export const GeolocationContext = createContext(null);

export const GEOHASH_SIZE = 32;

const GeolocationProvider = ({ children }) => {

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);

  const { requestForegroundGeolocation, geolocationForegroundState } = usePermissions();

  useEffectForegroundOnly(() => {
    requestForegroundGeolocation();
    const geolocationWatchId = registerGeolocationListener();
    registerCompassListener();
    return () => {
      Geolocation.clearWatch(geolocationWatchId);
      CompassHeading.stop();
    };
  }, []);

  const registerGeolocationListener = () => Geolocation.watchPosition(
    (infos) => {
      const { latitude, longitude } = infos.coords;

      const hash = Geohash.encode_int(latitude, longitude, GEOHASH_SIZE);
      const geoHashs = [hash, ...Geohash.neighbors_int(hash, GEOHASH_SIZE)];

      setUserCoordinates({
        latitude,
        longitude,
        geoHashs,
      });
    },
    console.warn,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
      distanceFilter: 0,
    }
  );

  const registerCompassListener = () => CompassHeading.start(10, (infos) => {
    const { heading } = infos;
    setCompassHeading(heading);
  });

  return (
    <GeolocationContext.Provider value={{
      userCoordinates,
      compassHeading,
    }}>
      {geolocationForegroundState === 'granted' ? children : <GeolocationModal />}
    </GeolocationContext.Provider>
  );
};

export default GeolocationProvider;

