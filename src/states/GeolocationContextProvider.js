import React, { createContext, useContext, useEffect, useState } from 'react';

import BackgroundGeolocation from 'react-native-background-geolocation';

import CompassHeading from 'react-native-compass-heading';
import API from '../services/API';
import { UserContext } from './UserContextProvider';

export const GeolocationContext = createContext(null);

const GeolocationProvider = ({ children }) => {

  const { user } = useContext(UserContext);

  const [userCoordinates, setUserCoordinates] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);

  useEffect(() => {
    registerCompassListener();
    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    if(user == null) {
      BackgroundGeolocation.stop();
      return;
    }
    const unsubscribeBackgroundGeolocation = registerBackgroundGeolocationListener();
    return unsubscribeBackgroundGeolocation;
  }, [user]);

  const registerCompassListener = () => CompassHeading.start(10, (infos) => {
    const { heading } = infos;
    setCompassHeading(heading);
  });

  const registerBackgroundGeolocationListener = () => {

    const onLocation = BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
      const { coords } = location;
      setUserCoordinates(coords);
    });

    const onMotionChange = BackgroundGeolocation.onMotionChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onActivityChange = BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onMotionChange]', event);
    });

    const onProviderChange = BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    });

    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 5,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.

      url: 'https://api.dropy-app.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        ...API.getHeaders(),
      },
    }).then(() => {
      console.log('Background geoloc ready');
      BackgroundGeolocation.start();
    });

    return () => {
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  };

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
