import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, Text } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Svg, { Path } from 'react-native-svg';

import Styles, { Colors, Fonts } from '../styles/Styles';
import GlassCircle from './GlassCircleButton';


const mainButtonSize = 64;
const iconsSize = 30;

const HomeScreenTabBar = () => {

  return (
    <View style={styles.container}>
      <Svg
        height="100%"
        width={responsiveWidth(100)}
        viewBox="0 0 375 87"
        style={styles.backgroundSvg}
      >
        <Path
          d={d}
          fill="white"
        />
      </Svg>
      <GlassCircle
        style={styles.mainButton}
        size={mainButtonSize}
        onPress={() => Alert.alert('Je me suis fait touché')}
      >
        <FontAwesome5 name="plus" size={20} color="white" />
      </GlassCircle>
      <View style={styles.tabsContainer}>
        <TabBarItem text="Drops" routeName="Museum">
          <Ionicons name="md-bookmark-outline" size={iconsSize} color={Colors.grey} />
        </TabBarItem>
        <TabBarItem text="Chat" routeName="Chat" showStatusDot>
          <Ionicons name="md-chatbubble-outline" size={iconsSize} color={Colors.grey} style={styles.icons} />
        </TabBarItem>
      </View>
    </View>
  );
};

const TabBarItem = ({ children, text, showStatusDot, routeName }) => {

  const navigation = useNavigation();

  const goToRoute = () => {
    navigation.navigate(routeName);
  };

  return (
    <TouchableOpacity style={styles.tabBtn} onPress={goToRoute}>
      {children}
      {showStatusDot && <View style={styles.statusDot} />}
      <Text style={styles.tabText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default HomeScreenTabBar;

const styles = StyleSheet.create({
  container: {
    height: 90,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    ...Styles.center
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    ...Styles.hardShadows
  },
  mainButton: {
    position: 'absolute',
    top: -mainButtonSize / 2
  },
  tabsContainer: {
    width: '120%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  tabBtn: {
    alignItems: 'center',
    width: '30%'
  },
  icons: {
    ...Styles.softShadows,
    shadowOpacity: 0.3,
    shadowColor: Colors.grey
  },
  tabText: {
    marginTop: 5,
    ...Fonts.bold(10, Colors.grey)
  },
  statusDot: {
    backgroundColor: Colors.red,
    width: 9,
    height: 9,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: '42%'
  }
});

const d = 'M 0 28 C 0 12.535995 12.535999 0 28 0 L 101.5 0 L 135.268005 0 C 143.283005 0 150.514999 4.8116 153.612 12.204597 L 154.119995 13.417099 C 166.593002 43.1978 208.985992 42.625 220.649994 12.518097 L 220.649994 12.518097 C 223.572998 4.9729 230.832993 0 238.924988 0 L 273.5 0 L 347 0 C 362.463989 0 375 12.535995 375 28 L 375 87 L 0 87 L 0 28 Z';
