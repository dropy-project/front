import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Animated
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import ProfileAvatar from '../components/ProfileAvatar';
import DropyMap from '../components/DropyMap';

import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';

const ICON_OPENED_SIZE = 40;

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const backIconAnimatedValue = useRef(new Animated.Value(0)).current;

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);

  const { dropiesAround, createDropy, retrieveDropy } = useDropiesAroundSocket();

  const { backgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);
  const shouldAnimateIcon = useRef(true);

  useEffect(() => {
    shouldAnimateIcon.current = true;
  }, [backgroundGeolocationEnabled]);

  useEffect(() => {
    if(dropyCreateParams != null) {
      setConfirmDropOverlayVisible(true);
    }
  }, [dropyCreateParams]);

  const closeConfirmDropOverlay = () => {
    setConfirmDropOverlayVisible(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if(shouldAnimateIcon.current === false) return;
      shouldAnimateIcon.current = false;


      const anim = Animated.sequence([
        Animated.timing(backIconAnimatedValue, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
        Animated.timing(backIconAnimatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        })
      ]);
      anim.start();
    });

    return unsubscribe;
  }, []);

  const iconScale = backIconAnimatedValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [backgroundGeolocationEnabled ? 0.7 : 0.5, 1, 1],
  });

  const iconMinWidth = backIconAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [ICON_OPENED_SIZE, 270],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <DropyMap dropiesAround={dropiesAround} retrieveDropy={retrieveDropy} />
      <SafeAreaView style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <ProfileAvatar size={70} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Animated.View style={{
              ...styles.backgroundGeolocIconContainer,
              transform: [{ scale: iconScale }],
              width: iconMinWidth,
            }}>
              <View style={styles.backgroundGeolocIconInnerContainer}>
                <FontAwesome5 name="satellite-dish" size={ICON_OPENED_SIZE - 20} color={backgroundGeolocationEnabled ? Colors.mainBlue : Colors.grey} />
                <Text allowFontScaling={false} style={styles.backgroundGeolocationText}>
                Background location {backgroundGeolocationEnabled ? 'enabled' : 'disabled'}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>
      <HomeScreenTabBar />
      <ConfirmDropyOverlay
        createDropy={createDropy}
        dropyCreateParams={dropyCreateParams}
        visible={confirmDropOverlayVisible}
        onCloseOverlay={closeConfirmDropOverlay}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
  },
  avatarContainer: {
    ...Styles.safeAreaView,
    position: 'absolute',
    top: 0,
    width: '90%',
  },
  backgroundGeolocIconContainer: {
    ...Styles.softShadows,
    position: 'absolute',
    height: ICON_OPENED_SIZE,
    justifyContent: 'space-between',
    bottom: -10,
    left: 40,
    backgroundColor: Colors.white,
    borderRadius: 100,
  },
  backgroundGeolocationText: {
    position: 'absolute',
    ...Fonts.regular(12, Colors.darkGrey),
    marginLeft: ICON_OPENED_SIZE + 5,
  },
  backgroundGeolocIconInnerContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 100,
    padding: 10,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
