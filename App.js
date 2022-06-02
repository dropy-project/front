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
      <UserProvider>
        <GeolocationProvider>
          <Navigation />
        </GeolocationProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
