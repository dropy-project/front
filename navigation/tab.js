import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../screens/ChatScreen";
import HomeScreen from "../screens/HomeScreen";
import MuseumScreen from "../screens/MuseumScreen";
import Svg1 from "../assets/svgs/add_drop_1.svg";
import Svg2 from "../assets/svgs/add_drop_2.svg";
import Svg3 from "../assets/svgs/add_drop_3.svg";

const Tab = createBottomTabNavigator();

const CustomTabarButton = ({ children, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      top: -30,
      justifyContent: "center",
      alignItems: "center",
      ...style.shadow,
    }}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#7B6DCD",
        overflow: "hidden",
      }}
    >
      <Svg1 height={70} width={70} style={{ ...style.svg, top: 10 }} />
      <Svg2 height={70} width={70} style={style.svg} />
      <Svg3 height={70} width={70} style={style.svg} />
      {children}
    </View>
  </TouchableOpacity>
);

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#fff",
          borderRadius: 15,
          height: 90,
          ...style.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../assets/icons/comment.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                  tintColor: focused ? "#a877af" : "#C4C4C4",
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/icons/plus.png")}
              style={{
                width: 30,
                height: 30,
                tintColor: "white",
              }}
            />
          ),
          tabBarButton: (props) => <CustomTabarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Museum"
        component={MuseumScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Image
                source={require("../assets/icons/museum.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                  tintColor: focused ? "#a877af" : "#C4C4C4",
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const style = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  svg: {
    position: "absolute",
  },
});
