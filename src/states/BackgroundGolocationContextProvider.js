//
// Philosophy of Operation
// https://github.com/transistorsoft/react-native-background-geolocation/wiki/Philosophy-of-Operation
//

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const [enableAfterInit, setEnableAfterInit] = useState(false);
  const [logs, setLogs] = useState(null);

  useEffect(() => {
    if (user == null)
      return;

    const locationSubscriber = BackgroundGeolocation.onLocation(() => {}, () => {});

    const motionChangeSubscriber = BackgroundGeolocation.onMotionChange(() => {});

    const activityChangeSubscriber = BackgroundGeolocation.onActivityChange(() => {});

    const authorizationChangeSubscriber = BackgroundGeolocation.onAuthorization((event) => {
      if (event.success)
        console.log('[authorization] SUCCESS: ', event.response);
      else
        console.error('[authorization] ERROR: ', event.error);
    });

    initializeBackgroundGeolocation().catch((error) => {
      console.error('Background geolocation loading error', error);
    });

    return () => {
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      activityChangeSubscriber.remove();
      authorizationChangeSubscriber.remove();
    };
  }, [user]);

  useEffect(() => {
    if (!initialized)
      return;

    log(`Background geolocation ${backgroundGeolocationEnabled ? 'enabled' : 'disabled'}`);

    if (backgroundGeolocationEnabled)
      BackgroundGeolocation.start();
    else
      BackgroundGeolocation.stop();
  }, [backgroundGeolocationEnabled, initialized]);

  const initializeBackgroundGeolocation = async () => {
    if (initialized === true)
      return;

    const authTokens = await Storage.getItem('@auth_tokens');

    if (authTokens == null) {
      log('Could not initialize : no auth tokens');
      return;
    }

    const state = await setupBackgroundGeolocation(authTokens);
    const enable = enableAfterInit || state.enabled;
    _setBackgroundGeolocationEnabled(enable);

    log(`Initialized successfully (started : ${enable})`);
    setInitialized(true);
  };

  const setupBackgroundGeolocation = async (authTokens) => {
    const { accessToken, refreshToken, expires } = authTokens;

    const backgroundGeolocationReady = await BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      useSignificantChangesOnly: true,

      logLevel: BackgroundGeolocation.LOG_LEVEL_WARNING,

      stopOnTerminate: false,
      startOnBoot: true,

      maxRecordsToPersist: 1,

      url: API.userBackgroundGeolocationPingUrl(),
      authorization: {
        strategy: 'JWT',
        accessToken,
        refreshToken,
        expires,
        refreshUrl: `${API.refreshTokenUrl()}?fromBackgroundGeolocation=1`,
        refreshPayload: {
          refreshToken: '{refreshToken}',
        },
      },
      backgroundPermissionRationale: {
        title: 'Autorise la géolocalisation en arrière-plan',
        message: 'Il est nécessaire d\'autoriser la géolocalisation en arrière-plan pour que l\'application puisse fonctionner correctement.',
        positiveAction: 'Autoriser',
      },
    });
    return backgroundGeolocationReady;
  };

  const setBackgroundGeolocationEnabled = async (enabled = false) => {
    try {
      if (enabled) {
        await BackgroundGeolocation.requestPermission();
        if (user != null)
          await initializeBackgroundGeolocation();
        else
          setEnableAfterInit(true);
      }
      _setBackgroundGeolocationEnabled(enabled);
    } catch (error) {
      log('Permission granting failed', error);
      _setBackgroundGeolocationEnabled(false);
    }
  };

  return (
    <BackgroundGeolocationContext.Provider value={{
      backgroundGeolocationEnabled,
      setBackgroundGeolocationEnabled,
    }}>
      {children}
      {logs != null && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', ...Styles.center }}>
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
