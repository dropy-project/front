import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Animated,
  Easing
} from 'react-native';

import { FontAwesome5, Ionicons, MaterialCommunityIcons, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Svg, { Path } from 'react-native-svg';

import Haptics from '../utils/haptics';

import Styles, { Colors, Fonts } from '../styles/Styles';
import useOverlay from '../hooks/useOverlay';
import GlassCircleButton from './GlassCircleButton';

const mainButtonSize = responsiveHeight(7.5);
const iconsSize = 30;

const HomeScreenTabBar = () => {
  const navigation = useNavigation();

  const [dropyMenuIsOpen, setDropyMenuIsOpen] = useState(false);
  const [renderMenuOverlay, setRenderMenuOverlay] = useState(false);

  const { sendAlert } = useOverlay();

  const menuAnimatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Haptics.impactLight();
    setRenderMenuOverlay(true);
    const anim = Animated.timing(menuAnimatedValue, {
      toValue: dropyMenuIsOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    });
    anim.start(({ finished }) => {
      if (finished && !dropyMenuIsOpen)
        setRenderMenuOverlay(false);
    });
    return anim.stop;
  }, [dropyMenuIsOpen]);

  const plusIconRotation = menuAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleAddPicture = () => {
    navigation.navigate('CreateDropyFromLibrary');
    setDropyMenuIsOpen(false);
  };

  const handleAddText = () => {
    navigation.navigate('CreateDropyText');
    setDropyMenuIsOpen(false);
  };

  const handleTakePicture = () => {
    navigation.navigate('CreateDropyTakePicture');
    setDropyMenuIsOpen(false);
  };

  const handleMusic = () => {
    setDropyMenuIsOpen(false);
    sendAlert({
      title: 'Not available yet',
      description: 'Creating musical drops will soon be possible.',
      validateText: 'OK !',
    });
  };

  return (
    <View style={styles.container}>
      <Svg
        height="100%"
        width={responsiveWidth(100)}
        viewBox="0 0 375 87"
        style={styles.backgroundSvg}
        preserveAspectRatio="none"
      >
        <Path d={d} fill="white" />
      </Svg>
      <View style={styles.tabsContainer}>
        <TabBarItem text="Drops">
          <Ionicons
            name="md-bookmark-outline"
            size={iconsSize}
            color={Colors.grey}
          />
        </TabBarItem>
        <TabBarItem text="Chat" routeName="Conversations" showStatusDot>
          <Ionicons
            name="md-chatbubble-outline"
            size={iconsSize}
            color={Colors.grey}
            style={styles.icons}
          />
        </TabBarItem>
      </View>
      {renderMenuOverlay && (
        <>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setDropyMenuIsOpen(false)}>
            <Animated.View style={{ ...styles.backgroundOverlay, opacity: menuAnimatedValue }} />
          </TouchableOpacity>
          <DropyWheel isOpen={dropyMenuIsOpen} menuAnimatedValue={menuAnimatedValue}>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleAddPicture}>
              <SimpleLineIcons name="picture" size={30} color={Colors.grey} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleAddText}>
              <MaterialCommunityIcons name="format-text" size={30} color={Colors.grey}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleTakePicture}>
              <Entypo name="camera" size={30} color={Colors.grey} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleMusic}>
              <Ionicons name="musical-notes-outline" size={30} color={Colors.grey} />
            </TouchableOpacity>
          </DropyWheel>
        </>
      )}
      <GlassCircleButton
        style={styles.mainButton}
        size={mainButtonSize}
        onPress={() => setDropyMenuIsOpen(!dropyMenuIsOpen)}
      >
        <Animated.View style={{ transform: [{ rotate: plusIconRotation }] }}>
          <FontAwesome5 name="plus" size={20} color="white" />
        </Animated.View>
      </GlassCircleButton>
    </View>
  );
};

const DropyWheel = ({ menuAnimatedValue, children }) => {
  return (
    <Animated.View style={{ ...styles.dropyWheelContainer, transform: [{ scale: menuAnimatedValue }] }}>
      {children.map((child, index) => (
        <DropyWheelItem key={index} index={index} childCount={children.length} size={100}>{child}</DropyWheelItem>
      ))}
    </Animated.View>
  );
};

const DropyWheelItem = ({ children, index, childCount, size }) => {

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleLayout = (event) => {
    const { layout } = event.nativeEvent;

    const angle = index * Math.PI / (childCount - 1) + Math.PI / 2;

    let x = (Math.sin(angle) * size);
    let y = (Math.cos(angle) * size);

    x += responsiveWidth(100) / 2 - layout.width / 2;
    y += 100 - layout.height / 2;

    setCoords({ x, y });
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View onLayout={handleLayout} key={index} style={{ position: 'absolute', top: coords.y, left: coords.x }}>
      {children}
    </View>
  );
};

const TabBarItem = ({ children, text, showStatusDot, routeName }) => {

  const { sendAlert } = useOverlay();
  const navigation = useNavigation();

  const goToRoute = () => {
    if(routeName == null) {
      sendAlert({
        title: 'Oups...',
        description: 'Looks like you can\'t go there yet... \n This page is under construction !',
        validateText: 'OK !',
      });
      return;
    }
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
    height: responsiveHeight(11),
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    ...Styles.center,
  },
  backgroundOverlay: {
    position: 'absolute',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    ...Styles.hardShadows,
  },
  mainButton: {
    position: 'absolute',
    top: -mainButtonSize / 2,
  },
  tabsContainer: {
    width: '120%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tabBtn: {
    alignItems: 'center',
    width: '30%',
  },
  icons: {
    ...Styles.softShadows,
    shadowOpacity: 0.3,
    shadowColor: Colors.grey,
  },
  tabText: {
    marginTop: 5,
    ...Fonts.bold(10, Colors.grey),
  },
  statusDot: {
    backgroundColor: Colors.red,
    width: 9,
    height: 9,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: '42%',
  },
  dropyWheelContainer: {
    position: 'absolute',
    bottom: 0,
    width: responsiveWidth(100),
    height: '200%',
  },
  dropySelectionButton: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 100,
    ...Styles.center,
    ...Styles.hardShadows,
  },
});

const d = 'M 0 28 C 0 12.535995 12.535999 0 28 0 L 101.5 0 L 135.268005 0 C 143.283005 0 150.514999 4.8116 153.612 12.204597 L 154.119995 13.417099 C 166.593002 43.1978 208.985992 42.625 220.649994 12.518097 L 220.649994 12.518097 C 223.572998 4.9729 230.832993 0 238.924988 0 L 273.5 0 L 347 0 C 362.463989 0 375 12.535995 375 28 L 375 87 L 0 87 L 0 28 Z';
