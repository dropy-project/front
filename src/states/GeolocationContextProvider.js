import React, { createContext, useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import CompassHeading from 'react-native-compass-heading';

export const GeolocationContext = createContext(null);

const GeolocationProvider = ({ children }) => {

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [isGeolocationEnabled, setGeolocation] = useState(false);

  useEffect(() => {
    const geolocationWatchId = registerGeolocationListener();
    registerCompassListener();
    return () => {
      Geolocation.clearWatch(geolocationWatchId);
      CompassHeading.stop();
    };
  }, []);

  const registerGeolocationListener = () => Geolocation.watchPosition(
    (infos) => {
      const { coords } = infos;
      setUserCoordinates(coords);
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

