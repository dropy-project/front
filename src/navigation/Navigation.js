import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import MuseumScreen from '../screens/MuseumScreen';

const MainStack = createStackNavigator();

export default function Navigation() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="Museum" component={MuseumScreen} />
    </MainStack.Navigator>
  );
}

// const Tab = createBottomTabNavigator();

// const Navigation = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarShowLabel: false,
//         headerShown: false,
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: 25,
//           left: 20,
//           right: 20,
//           elevation: 0,
//           backgroundColor: '#fff',
//           borderRadius: 15,
//           height: 90,
//           ...style.shadow
//         }
//       }}
//     >
//       <Tab.Screen
//         name="Chat"
//         component={ChatScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 top: 10
//               }}
//             >
//               <Image
//                 source={require('../assets/icons/comment.png')}
//                 resizeMode="contain"
//                 style={{
//                   width: 35,
//                   height: 35,
//                   tintColor: focused ? '#a877af' : '#C4C4C4'
//                 }}
//               />
//             </View>
//           )
//         }}
//       />
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: () => (
//             <Image
//               source={require('../assets/icons/plus.png')}
//               style={{
//                 width: 30,
//                 height: 30,
//                 tintColor: 'white'
//               }}
//             />
//           ),
//           tabBarButton: (props) => <CustomTabarButton {...props} />
//         }}
//       />
//       <Tab.Screen
//         name="Museum"
//         component={MuseumScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={{
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 top: 10
//               }}
//             >
//               <Image
//                 source={require('../assets/icons/museum.png')}
//                 resizeMode="contain"
//                 style={{
//                   width: 35,
//                   height: 35,
//                   tintColor: focused ? '#a877af' : '#C4C4C4'
//                 }}
//               />
//             </View>
//           )
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default Navigation;

// const style = StyleSheet.create({
//   shadow: {
//     shadowColor: '#7F5DF0',
//     shadowOffset: {
//       width: 0,
//       height: 10
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5
//   }
// });
