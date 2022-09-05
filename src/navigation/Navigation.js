import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import RegisterScreen from '../screens/RegisterScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import HomeScreen from '../screens/HomeScreen';
import Splash from '../screens/Splash';
import CreateDropyTextScreen from '../screens/CreateDropyTextScreen';
import CreateDropyFromLibrary from '../screens/CreateDropyFromLibrary';
import GetDropyScreen from '../screens/GetDropyScreen';
import CreateDropyTakePicture from '../screens/CreateDropyTakePicture';
import ChatScreen from '../screens/ChatScreen';
import DisplayDropyMediaScreen from '../screens/DisplayDropyMediaScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import BlockedUsersScreen from '../screens/BlockedUsersScreen';
import UserDropiesScreen from '../screens/UserDropiesScreen';

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
      <MainStack.Screen name="Conversations" component={ConversationsScreen}/>
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="CreateDropyText" component={CreateDropyTextScreen} />
      <MainStack.Screen name="CreateDropyFromLibrary" component={CreateDropyFromLibrary} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
      <MainStack.Screen name="CreateDropyTakePicture" component={CreateDropyTakePicture} options={{ ...TransitionPresets.ModalSlideFromBottomIOS }} />
      <MainStack.Screen name="GetDropy" component={GetDropyScreen} />
      <MainStack.Screen name="DisplayDropyMedia" component={DisplayDropyMediaScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
      <MainStack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
      <MainStack.Screen name="UserDropies" component={UserDropiesScreen} />
    </MainStack.Navigator>
  );
}
