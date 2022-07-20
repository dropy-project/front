import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import {
  useFonts,
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk';

import * as Sentry from '@sentry/react-native';

import Navigation from './src/navigation/Navigation';
import UserProvider from './src/states/UserContextProvider';
import GeolocationProvider from './src/states/GeolocationContextProvider';
import BackgroundGolocationContextProvider from './src/states/BackgroundGolocationContextProvider';
import NotificationProvider from './src/states/NotificationProvider';
import OverlayContextProvider from './src/states/OverlayContextProvider';
import SocketProvider from './src/states/SocketContextProvider';


Sentry.init({
  dsn: 'https://19407e7c32a2487689649a399a55c564@o1315355.ingest.sentry.io/6567185',
  // eslint-disable-next-line no-undef
  environment: __DEV__ ? 'dev' : 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

export default function App() {

  let [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if(!fontsLoaded)
    return null;

  return (
    <NavigationContainer>
      <OverlayContextProvider>
        <UserProvider>
          <NotificationProvider>
            <BackgroundGolocationContextProvider>
              <GeolocationProvider>
                <SocketProvider>
                  <Navigation />
                </SocketProvider>
              </GeolocationProvider>
            </BackgroundGolocationContextProvider>
          </NotificationProvider>
        </UserProvider>
      </OverlayContextProvider>
    </NavigationContainer>
  );
}
