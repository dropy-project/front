import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

/* eslint-disable camelcase */
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts
} from '@expo-google-fonts/space-grotesk';

import * as Sentry from '@sentry/react-native';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import { StatusBar } from 'react-native';
import Navigation from './src/navigation/Navigation';
import UserProvider from './src/states/UserContextProvider';
import GeolocationProvider from './src/states/GeolocationContextProvider';
import BackgroundGolocationContextProvider from './src/states/BackgroundGolocationContextProvider';
import NotificationProvider from './src/states/NotificationProvider';
import OverlayContextProvider from './src/states/OverlayContextProvider';
import SocketContextProvider from './src/states/SocketContextProvider';
import ConversationsContextProvider from './src/states/ConversationsContextProvider';
import DropiesAroundContextProvider from './src/states/DropiesAroundContextProvider';
import { Colors } from './src/styles/Styles';

Sentry.init({
  dsn: 'https://19407e7c32a2487689649a399a55c564@o1315355.ingest.sentry.io/6567185',

  environment: __DEV__ ? 'dev' : 'production',

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  // eslint-disable-next-line no-undef
  tracesSampleRate: __DEV__ ? 1.0 : 0.5,
});

const NavigationApp = () => (
  <NavigationContainer>
    <StatusBar barStyle='light-content' backgroundColor={Colors.purple3} />
    <OverlayContextProvider>
      <UserProvider>
        <BackgroundGolocationContextProvider>
          <GeolocationProvider>
            <SocketContextProvider>
              <DropiesAroundContextProvider>
                <ConversationsContextProvider>
                  <NotificationProvider>
                    <Navigation />
                  </NotificationProvider>
                </ConversationsContextProvider>
              </DropiesAroundContextProvider>
            </SocketContextProvider>
          </GeolocationProvider>
        </BackgroundGolocationContextProvider>
      </UserProvider>
    </OverlayContextProvider>
  </NavigationContainer>
);

const ConnectedNavigationApp = connectActionSheet(NavigationApp);

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded)
    return null;

  return (
    <ActionSheetProvider>
      <ConnectedNavigationApp />
    </ActionSheetProvider>
  );
}
