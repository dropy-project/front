import React, { createContext, useState , useEffect } from 'react';
import Geolocation from 'react-native-geolocation-service';
import CompassHeading from 'react-native-compass-heading';
import Geohash from 'ngeohash';

import useCurrentUser from '../hooks/useCurrentUser';

export const GeolocationContext = createContext(null);

export const GEOHASH_SIZE = 32;

const GeolocationProvider = ({ children }) => {

  const { user } = useCurrentUser();

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(user == null) return;
    if (initialized) return;
    setInitialized(true);
    const geolocationWatchId = registerGeolocationListener();
    registerCompassListener();
    return () => {
      Geolocation.clearWatch(geolocationWatchId);
      CompassHeading.stop();
    };
  }, [user]);

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
      {children}
    </GeolocationContext.Provider>
  );
};

export default GeolocationProvider;

