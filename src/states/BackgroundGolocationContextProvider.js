/*
Philosophy of Operation

https://github.com/transistorsoft/react-native-background-geolocation/wiki/Philosophy-of-Operation
*/
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import BackgroundGeolocation from 'react-native-background-geolocation';

import API from '../services/API';
import Storage from '../utils/storage';

import { UserContext } from './UserContextProvider';

const log = (...params) => {
  console.log('\x1b[36m[ BackgroundGeolocation ]\x1b[0m', ...params);
};

export const BackgroundGeolocationContext = createContext(null);

const BackgroundGolocationProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const appState = useRef(AppState.currentState);

  const [backgroundGeolocationEnabled, setBackgroundGeolocationEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
    });
    return () => {
      appStateListener.remove();
    };
  }, []);

  useEffect(() => {
    initializeBackgroundGeolocation().catch(error => {
      log('LOADING ERROR', error);
    });
  }, [user]);

  const initializeBackgroundGeolocation = async () => {
    const storedUserId = await Storage.getItem('@background_geolocation_user_id');

    if(storedUserId == null && user == null) {
      log('Could not initialize as no user is stored or logged in');
      return;
    }

    if(user != null) {
      log('Stored userId updated for user with id:', user.id);
      Storage.setItem('@background_geolocation_user_id', user.id);
    }

    if(initialized === true) {
      return;
    }

    const userId = storedUserId ?? user.id;

    await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,

      logLevel: BackgroundGeolocation.LOG_LEVEL_INFO,

      stopOnTerminate: false,
      startOnBoot: true,

      preventSuspend: true, // Warning : high battery usage (Force the app to be opened in background)
      heartbeatInterval: 60,

      batchSync: false,
      autoSync: true,

      url: API.userLocationPingUrl(userId),
      headers: API.getHeaders(),
    });

    const enabledByUser = await Storage.getItem('@background_geolocation_enabled');
    setBackgroundGeolocationEnabled(enabledByUser ?? false);
    log('Initialized with state : ', enabledByUser);

    setInitialized(true);
  };

  useEffect(() => {
    if(!initialized) {
      return;
    }

    log('Background state : ', backgroundGeolocationEnabled);

    if (backgroundGeolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }

    Storage.setItem('@background_geolocation_enabled', backgroundGeolocationEnabled);
  }, [backgroundGeolocationEnabled]);

  if(appState.current === 'background') {
    // L'appli lancée en background (par la librairie au moment de ping)
    // n'a pas besoin de render le reste.
    return null;
  }

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
