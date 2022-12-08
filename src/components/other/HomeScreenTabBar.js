import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Svg, { Path } from 'react-native-svg';

import Haptics from '../../utils/haptics';

import Styles, { Colors, Fonts } from '../../styles/Styles';
import useOverlay from '../../hooks/useOverlay';
import useUnreadConversation from '../../hooks/useUnreadConversation';
import useCurrentUser from '../../hooks/useCurrentUser';
import GlassCircleButton from '../input/GlassCircleButton';
import useDropiesAroundSocket from '../../hooks/useDropiesAroundSocket';

const mainButtonSize = responsiveHeight(7.5);
const iconsSize = 30;

const HomeScreenTabBar = ({ onMuseumOpenPressed, onMuseumClosePressed, museumVisible }) => {
  const navigation = useNavigation();

  const { canEmitDropy } = useDropiesAroundSocket();
  const { developerMode } = useCurrentUser();

  const tabBarAnimatedValue = useRef(new Animated.Value(0)).current;
  const mainButtonAnimatedValue = useRef(new Animated.Value(0)).current;
  const wheelAnimatedValue = useRef(new Animated.Value(0)).current;

  const [dropyMenuIsOpen, setDropyMenuIsOpen] = useState(false);
  const [renderMenuOverlay, setRenderMenuOverlay] = useState(false);
  const [renderMuseumCloseButton, setRenderMuseumCloseButton] = useState(false);

  const hasUnreadConversation = useUnreadConversation();

  const { sendAlert } = useOverlay();

  useEffect(() => {
    Haptics.impactLight();
    setRenderMenuOverlay(true);
    const anim = Animated.timing(wheelAnimatedValue, {
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

  useEffect(() => {
    Haptics.impactLight();
    const anim = Animated.timing(tabBarAnimatedValue, {
      toValue: museumVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    });
    anim.start();
    return anim.stop;
  }, [museumVisible]);

  useEffect(() => {
    Haptics.impactLight();
    setRenderMuseumCloseButton(true);
    const anim = Animated.timing(mainButtonAnimatedValue, {
      toValue: museumVisible ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.elastic(1.1),
    });
    anim.start(({ finished }) => {
      if (finished && !museumVisible)
        setRenderMuseumCloseButton(false);
    });
    return anim.stop;
  }, [museumVisible]);

  const plusIconRotation = wheelAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const tabBarTranslateY = tabBarAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, responsiveHeight(20)],
  });

  const glassButtonOpacity = tabBarAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const glassButtonScale = mainButtonAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const museumCloseButtonScale = mainButtonAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
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

  // const handleMusic = () => {
  //   setDropyMenuIsOpen(false);
  //   sendAlert({
  //     title: 'Not available yet',
  //     description: 'Creating musical drops will soon be possible.',
  //     validateText: 'OK !',
  //   });
  // };

  const onPressGlassButton = async () => {
    if (canEmitDropy) {
      setDropyMenuIsOpen(!dropyMenuIsOpen);
      return;
    }
    if (!dropyMenuIsOpen) {
      const validated = await sendAlert({
        title: 'Mollo !',
        description: 'Tu ne peux pas poser deux drops au même endroit !',
        validateText: 'Ok !',
        // eslint-disable-next-line no-undef
        denyText: developerMode || __DEV__ ? 'DEV_ADD' : undefined,
      });
      setDropyMenuIsOpen(!validated);
    } else
      setDropyMenuIsOpen(!dropyMenuIsOpen);
  };

  useEffect(() => {
    if (!canEmitDropy)
      setDropyMenuIsOpen(false);
  }, [canEmitDropy]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateY: tabBarTranslateY }],
        }}
      >
        <Svg
          height='100%'
          width={responsiveWidth(100)}
          viewBox='0 0 375 87'
          style={styles.backgroundSvg}
          preserveAspectRatio='none'
        >
          <Path d={d} fill='white' />
        </Svg>
      </Animated.View>
      <Animated.View style={{
        ...styles.tabsContainer,
        transform: [{ translateY: tabBarTranslateY }],
      }}>
        <TabBarItem text='Drops' onPress={onMuseumOpenPressed}>
          <Ionicons
            name='md-bookmark-outline'
            size={iconsSize}
            color={Colors.darkGrey}
          />
        </TabBarItem>
        <TabBarItem text='Chat' routeName='Conversations' showStatusDot={hasUnreadConversation}>
          <Ionicons
            name='md-chatbubble-outline'
            size={iconsSize}
            color={Colors.darkGrey}
            style={styles.icons}
          />
        </TabBarItem>
      </Animated.View>
      {renderMenuOverlay && (
        <>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={() => setDropyMenuIsOpen(false)}>
            <Animated.View style={{ ...styles.backgroundOverlay, opacity: wheelAnimatedValue }} />
          </TouchableOpacity>
          <DropyWheel isOpen={dropyMenuIsOpen} menuAnimatedValue={wheelAnimatedValue}>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleAddPicture}>
              <SimpleLineIcons name='picture' size={30} color={Colors.grey} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleAddText}>
              <MaterialCommunityIcons name='format-text' size={30} color={Colors.grey}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropySelectionButton} onPress={handleTakePicture}>
              <Entypo name='camera' size={30} color={Colors.grey} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.dropySelectionButton} onPress={handleMusic}>
              <Ionicons name='musical-notes-outline' size={30} color={Colors.grey} />
            </TouchableOpacity> */}
          </DropyWheel>
        </>
      )}

      <Animated.View style={{
        ...styles.mainButton,
        opacity: glassButtonOpacity,
        transform: [{ scale: glassButtonScale }],
      }}>
        <GlassCircleButton
          size={mainButtonSize}
          onPress={onPressGlassButton}
          activeOpacity={canEmitDropy ? 0.5 : 0.8}
        >
          {canEmitDropy ? (
            <Animated.View style={{ transform: [{ rotate: plusIconRotation }] }}>
              <FontAwesome5 name='plus' size={20} color={Colors.white} />
            </Animated.View>
          ) : (
            <View style={{
              ...Styles.center,
              ...StyleSheet.absoluteFillObject,
              backgroundColor: Colors.lightGrey,
              opacity: 0.5,
            }}>
              <Entypo name='block' size={24} color={Colors.white} />
            </View>
          )}
        </GlassCircleButton>
      </Animated.View>

      {renderMuseumCloseButton && (
        <Animated.View style={{
          ...styles.mainButton,
          opacity: tabBarAnimatedValue,
          transform: [{ scale: museumCloseButtonScale }],
        }}>
          <TouchableOpacity onPress={onMuseumClosePressed} style={styles.closeMuseumButton}>
            <View style={{ transform: [{ rotate: '45deg' }] }}>
              <FontAwesome5 name='plus' size={20} color={Colors.darkGrey} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const DropyWheel = ({ menuAnimatedValue, children }) => (
  <Animated.View style={{ ...styles.dropyWheelContainer, transform: [{ scale: menuAnimatedValue }] }}>
    {children.map((child, index) => (
      <DropyWheelItem key={index} index={index} childCount={children.length} size={110}>{child}</DropyWheelItem>
    ))}
  </Animated.View>
);

const DropyWheelItem = ({ children, index, childCount, size }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleLayout = (event) => {
    const { layout } = event.nativeEvent;

    const itemAngleDiff = (index * Math.PI / 2);
    const angle = (itemAngleDiff / (childCount - 1)) + (3 * Math.PI / 4);

    let x = (Math.sin(angle) * size);
    let y = (Math.cos(angle) * size);

    x += (responsiveWidth(100) / 2) - (layout.width / 2);
    y += 100 - (layout.height / 2);

    setCoords({ x, y });
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View onLayout={handleLayout} key={index} style={{ position: 'absolute', top: coords.y, left: coords.x }}>
      {children}
    </View>
  );
};

const TabBarItem = ({ children, text, showStatusDot, routeName, onPress }) => {
  const { sendAlert } = useOverlay();
  const navigation = useNavigation();

  const goToRoute = () => {
    if (routeName == null) {
      sendAlert({
        title: 'Aïe...',
        description: 'Cette page est encore en construction !',
        validateText: 'Ok !',
      });
      return;
    }
    navigation.navigate(routeName);
  };

  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress ?? goToRoute}>
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
    ...Fonts.bold(10, Colors.darkGrey),
  },
  statusDot: {
    backgroundColor: Colors.purple2,
    width: 12,
    height: 12,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: '40%',
    borderColor: Colors.white,
    borderWidth: 2,
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
  closeMuseumButton: {
    backgroundColor: Colors.white,
    width: mainButtonSize,
    height: mainButtonSize,
    borderRadius: mainButtonSize,
    ...Styles.center,
    ...Styles.softShadows,
  },
});

const d = 'M 0 28 C 0 12.535995 12.535999 0 28 0 L 101.5 0 L 135.268005 0 C 143.283005 0 150.514999 4.8116 153.612 12.204597 L 154.119995 13.417099 C 166.593002 43.1978 208.985992 42.625 220.649994 12.518097 L 220.649994 12.518097 C 223.572998 4.9729 230.832993 0 238.924988 0 L 273.5 0 L 347 0 C 362.463989 0 375 12.535995 375 28 L 375 87 L 0 87 L 0 28 Z';
