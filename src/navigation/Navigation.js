import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MuseumScreen from '../screens/MuseumScreen';
import Splash from '../screens/Splash';
import CreateDropyTextScreen from '../screens/CreateDropyTextScreen';
import CreateDropyFromLibrary from '../screens/CreateDropyFromLibrary';
import GetDropyScreen from '../screens/GetDropyScreen';

const MainStack = createStackNavigator();

export default function Navigation() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <MainStack.Screen name="Splash" component={Splash} />
      <MainStack.Screen name="Register" component={RegisterScreen} />
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="Museum" component={MuseumScreen} />
      <MainStack.Screen name="CreateDropyText" component={CreateDropyTextScreen} />
      <MainStack.Screen name="CreateDropyFromLibrary" component={CreateDropyFromLibrary} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
      <MainStack.Screen name="GetDropy" component={GetDropyScreen} />
    </MainStack.Navigator>
  );
}
