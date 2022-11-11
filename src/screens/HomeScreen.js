import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import ProfileAvatar from '../components/ProfileAvatar';
import DropyMap from '../components/DropyMap';

import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import MuseumOverlay from '../components/MuseumOverlay';
import Haptics from '../utils/haptics';

const BACKGROUND_GEOLOC_ICON_OPENED_SIZE = 40;

const HomeScreen = ({ navigation, route }) => {
  const { dropyCreateParams = null } = route.params || {};

  const backgroundGeolocIconAnimatedValue = useRef(new Animated.Value(0)).current;

  const { dropiesAround, createDropy, retrieveDropy, canEmitDropy } = useDropiesAroundSocket();

  const { backgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);
  const shouldAnimateBackgroundGeolocIcon = useRef(true);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);
  const [museumOverlayVisible, setMuseumOverlayVisible] = useState(false);

  const [selectedDropyIndex, setSelectedDropyIndex] = useState(null);
  const [retrievedDropies, setRetrievedDropies] = useState(null);

  useEffect(() => {
    shouldAnimateBackgroundGeolocIcon.current = true;
  }, [backgroundGeolocationEnabled]);

  useEffect(() => {
    if (dropyCreateParams != null)
      setConfirmDropOverlayVisible(true);
  }, [dropyCreateParams]);

  useEffect(() => {
    if (!museumOverlayVisible) {
      setSelectedDropyIndex(null);
      setRetrievedDropies(null);
    }
  }, [museumOverlayVisible]);

  useEffect(() => {
    if (selectedDropyIndex != null)
      Haptics.impactLight();
  }, [selectedDropyIndex]);

  const closeConfirmDropOverlay = () => {
    setConfirmDropOverlayVisible(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (shouldAnimateBackgroundGeolocIcon.current === false)
        return;
      shouldAnimateBackgroundGeolocIcon.current = false;


      const anim = Animated.sequence([
        Animated.timing(backgroundGeolocIconAnimatedValue, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
        Animated.timing(backgroundGeolocIconAnimatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        })
      ]);
      anim.start();
    });

    return unsubscribe;
  }, []);

  const iconScale = backgroundGeolocIconAnimatedValue.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [backgroundGeolocationEnabled ? 0.7 : 0.5, 1, 1],
  });

  const iconMinWidth = backgroundGeolocIconAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [BACKGROUND_GEOLOC_ICON_OPENED_SIZE, 270],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />

      <DropyMap
        retrievedDropies={retrievedDropies}
        dropiesAround={dropiesAround}
        retrieveDropy={retrieveDropy}
        museumVisible={museumOverlayVisible}
        selectedDropyIndex={selectedDropyIndex}
      />

      <SafeAreaView style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ width: 80 }}>
          <ProfileAvatar size={70} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Animated.View style={{
              ...styles.backgroundGeolocIconContainer,
              transform: [{ scale: iconScale }],
              width: iconMinWidth,
            }}>
              <View style={styles.backgroundGeolocIconInnerContainer}>
                <FontAwesome5 name='satellite-dish' size={BACKGROUND_GEOLOC_ICON_OPENED_SIZE - 20} color={backgroundGeolocationEnabled ? Colors.mainBlue : Colors.grey} />
                <Text allowFontScaling={false} style={styles.backgroundGeolocationText}>
                Background location {backgroundGeolocationEnabled ? 'enabled' : 'disabled'}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>

      <MuseumOverlay
        visible={museumOverlayVisible}
        setSelectedDropyIndex={setSelectedDropyIndex}
        setRetrievedDropies={setRetrievedDropies}
      />

      <HomeScreenTabBar
        onMuseumOpenPressed={() => setMuseumOverlayVisible(true)}
        onMuseumClosePressed={() => setMuseumOverlayVisible(false)}
        museumVisible={museumOverlayVisible}
        canEmitDropy={canEmitDropy}
      />

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
    height: BACKGROUND_GEOLOC_ICON_OPENED_SIZE,
    justifyContent: 'space-between',
    bottom: -10,
    left: 40,
    backgroundColor: Colors.white,
    borderRadius: 100,
  },
  backgroundGeolocationText: {
    position: 'absolute',
    ...Fonts.regular(12, Colors.darkGrey),
    marginLeft: BACKGROUND_GEOLOC_ICON_OPENED_SIZE + 5,
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
