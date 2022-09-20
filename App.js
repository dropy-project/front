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
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import Navigation from './src/navigation/Navigation';
import UserProvider from './src/states/UserContextProvider';
import GeolocationProvider from './src/states/GeolocationContextProvider';
import BackgroundGolocationContextProvider from './src/states/BackgroundGolocationContextProvider';
import NotificationProvider from './src/states/NotificationProvider';
import OverlayContextProvider from './src/states/OverlayContextProvider';
import SocketContextProvider from './src/states/SocketContextProvider';
import ConversationsContextProvider from './src/states/ConversationsContextProvider';
import MapboxGL from '@react-native-mapbox-gl/maps';


Sentry.init({
  dsn: 'https://19407e7c32a2487689649a399a55c564@o1315355.ingest.sentry.io/6567185',
  // eslint-disable-next-line no-undef
  environment: __DEV__ ? 'dev' : 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

MapboxGL.setAccessToken('pk.eyJ1IjoiZHJvcHkiLCJhIjoiY2w4YWQ5eXlhMGZ1aTNucGIxMGV6dW9ldSJ9.5624esQHo1lP5BFVo4f7Jg');

const NavigationApp = () => {
  return (
    <NavigationContainer>
      <OverlayContextProvider>
        <UserProvider>
          <BackgroundGolocationContextProvider>
            <GeolocationProvider>
              <SocketContextProvider>
                <ConversationsContextProvider>
                  <NotificationProvider>
                    <Navigation />
                  </NotificationProvider>
                </ConversationsContextProvider>
              </SocketContextProvider>
            </GeolocationProvider>
          </BackgroundGolocationContextProvider>
        </UserProvider>
      </OverlayContextProvider>
    </NavigationContainer>
  );
};

const ConnectedNavigationApp = connectActionSheet(NavigationApp);

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
    <ActionSheetProvider>
      <ConnectedNavigationApp />
    </ActionSheetProvider>
  );
}


