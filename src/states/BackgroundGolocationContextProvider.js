/*
Philosophy of Operation
https://github.com/transistorsoft/react-native-background-geolocation/wiki/Philosophy-of-Operation
*/

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import Storage from '../utils/storage';

import { UserContext } from './UserContextProvider';

export const BackgroundGeolocationContext = createContext(null);

const BackgroundGolocationProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [backgroundGeolocationEnabled, _setBackgroundGeolocationEnabled] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [logs, setLogs] = useState(null);

  const initialAppState = useRef(AppState.currentState).current;

  useEffect(() => {
    const locationSubscriber = BackgroundGeolocation.onLocation(() => {}, (error) => {
      console.warn('[onLocation] ERROR: ', error);
    });

    const motionChangeSubscriber = BackgroundGeolocation.onMotionChange((location) => {
      console.log('[onMotionChange]', location);
    });

    const activityChangeSubscriber = BackgroundGeolocation.onActivityChange((activity) => {
      console.log('[onActivityChange]', activity);
    });

    initializeBackgroundGeolocation().catch(error => {
      console.error('Background geolocation loading error', error);
    });

    return () => {
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      activityChangeSubscriber.remove();
    };
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

    const state = await setupBackgroundGeolocation(authTokens);
    _setBackgroundGeolocationEnabled(state.enabled);

    log(`Initialized successfully (started : ${state.enabled}`);
    setInitialized(true);
  };

  const setupBackgroundGeolocation = async (authTokens) => {
    return await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,

      logLevel: BackgroundGeolocation.LOG_LEVEL_WARNING,

      stopOnTerminate: false,
      startOnBoot: true,

      url: API.userBackgroundGeolocationPingUrl(),
      headers: {
        'Authorization': authTokens.authTokenData.token,
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

  const showLogs = async () => {
    const data = await BackgroundGeolocation.logger.getLog({
      limit: 200,
    });
    if(logs == null) {
      setLogs(data);
      console.log(data);
    } else {
      setLogs(null);
    }
  };

  if(initialAppState === 'background') {
    log('Render Skipped - App has been launched in background');
    return null;
  }

  return (
    <BackgroundGeolocationContext.Provider value={{
      backgroundGeolocationEnabled,
      setBackgroundGeolocationEnabled,
      showLogs,
    }}>
      {children}
      {logs != null && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', ...Styles.center }}>
          <ScrollView contentContainerStyle={{ paddingVertical: 200 }}>
            <Text style={{ ...Fonts.ligth(8, Colors.white), padding: 10 }}>
              {logs}
            </Text>
          </ScrollView>
          <TouchableOpacity style={{ position: 'absolute', bottom: 30 }} onPress={() => setLogs(null)}>
            <Text style={{ ...Fonts.bold(14, Colors.white) }}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </BackgroundGeolocationContext.Provider>
  );
};

export default BackgroundGolocationProvider;

const log = (...params) => {
  console.log('\x1b[36m[ BackgroundGeolocation ]\x1b[0m', ...params);
};
