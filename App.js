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

import Navigation from './src/navigation/Navigation';
import UserProvider from './src/states/UserContextProvider';
import GeolocationProvider from './src/states/GeolocationContextProvider';
import BackgroundGolocationContextProvider from './src/states/BackgroundGolocationContextProvider';
import NotificationProvider from './src/states/NotificationProvider';
import OverlayContextProvider from './src/states/OverlayContextProvider';
import SocketProvider from './src/states/SocketProvider';

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
