/*
Philosophy of Operation
https://github.com/transistorsoft/react-native-background-geolocation/wiki/Philosophy-of-Operation
*/

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

import API from '../services/API';
import Storage from '../utils/storage';

import { UserContext } from './UserContextProvider';

export const BackgroundGeolocationContext = createContext(null);

const BackgroundGolocationProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [backgroundGeolocationEnabled, _setBackgroundGeolocationEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeBackgroundGeolocation().catch(error => {
      console.error('Background geolocation loading error', error);
    });
  }, [user]);

  useEffect(() => {
    if(!initialized) {
      return;
    }

    log(`Background geolocation ${backgroundGeolocationEnabled ? 'enabled' : 'disabled'}`);

    if (backgroundGeolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }, [backgroundGeolocationEnabled]);

  const initializeBackgroundGeolocation = async () => {
    if(initialized === true) {
      return;
    }

    const authTokens = await Storage.getItem('@auth_tokens');

    if(authTokens == null) {
      log('Could not initialize : no auth tokens');
      return;
    }

    await setupBackgroundGeolocationForUser(authTokens);

    const enabledByUser = await Storage.getItem('@background_geolocation_enabled');
    setBackgroundGeolocationEnabled(enabledByUser ?? false);
    log('Initialized successfully');

    setInitialized(true);
  };

  const setupBackgroundGeolocationForUser = async (authTokens) => {
    await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,

      logLevel: BackgroundGeolocation.LOG_LEVEL_ERROR,
      logMaxDays: 1,

      stopOnTerminate: false,
      startOnBoot: true,

      batchSync: false,
      autoSync: true,

      url: API.userBackgroundGeolocationPingUrl(),
      headers: {
        'Authorization': authTokens,
      },
    });
  };

  const setBackgroundGeolocationEnabled = async (enabled = false) => {
    try {
      if(enabled) {
        await BackgroundGeolocation.requestPermission();
      }
      _setBackgroundGeolocationEnabled(enabled);
      Storage.setItem('@background_geolocation_enabled', enabled);
    } catch (error) {
      log('Permission granting failed', error);
      _setBackgroundGeolocationEnabled(false);
      Alert.alert('dropy needs permissions', 'Please enable location services as \'Always\' for this app in settings.');
    }
  };

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

const log = (...params) => {
  console.log('\x1b[36m[ BackgroundGeolocation ]\x1b[0m', ...params);
};
