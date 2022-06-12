import React, { createContext, useContext, useEffect, useState } from 'react';

import BackgroundGeolocation from 'react-native-background-geolocation';

import API from '../services/API';
import { UserContext } from './UserContextProvider';

export const BackgroundGeolocationContext = createContext(null);

const BackgroundGolocationProvider = ({ children }) => {

  const { user } = useContext(UserContext);

  const [backgroundGeolocationEnabled, setBackgroundGeolocationEnabled] = useState(false);

  useEffect(() => {
    if(user == null) {
      BackgroundGeolocation.stop();
      return;
    }

    const onLocation = BackgroundGeolocation.onLocation(() => {});
    const onMotionChange = BackgroundGeolocation.onMotionChange(() => {});
    const onActivityChange = BackgroundGeolocation.onActivityChange(() => {});
    const onProviderChange = BackgroundGeolocation.onProviderChange(() => {});

    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 20,
      stopTimeout: 5,

      logLevel: BackgroundGeolocation.LOG_LEVEL_INFO,
      stopOnTerminate: false,
      startOnBoot: true,
      batchSync: false,
      autoSync: true,

      url: API.userLocationPingUrl(user.id),
      headers: API.getHeaders(),
    }).then((state) => {
      setBackgroundGeolocationEnabled(state.enabled);
    });

    return () => {
      onLocation.remove();
      onMotionChange.remove();
      onActivityChange.remove();
      onProviderChange.remove();
    };
  }, [user]);

  useEffect(() => {
    console.log('[BACKGROUND GEOLOCATION ACTIVE]', backgroundGeolocationEnabled);
    if (backgroundGeolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }, [backgroundGeolocationEnabled]);

  return (
    <BackgroundGeolocationContext.Provider value={{
      backgroundGeolocationEnabled,
      setBackgroundGeolocationEnabled,
    }}>
      {children}
    </BackgroundGeolocationContext.Provider>
  );
};

export default BackgroundGolocationProvider;
