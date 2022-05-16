import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MuseumScreen from '../screens/MuseumScreen';
import Splash from '../screens/Splash';

const MainStack = createStackNavigator();

export default function Navigation() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <MainStack.Screen name="Splash" component={Splash} />
      <MainStack.Screen name="Register" component={RegisterScreen} />
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="Museum" component={MuseumScreen} />
    </MainStack.Navigator>
  );
}
