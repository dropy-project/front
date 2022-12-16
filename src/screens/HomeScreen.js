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

import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';

import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import Haptics from '../utils/haptics';
import DropyMap from '../components/map/DropyMap';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import MuseumOverlay from '../components/overlays/MuseumOverlay';
import HomeScreenTabBar from '../components/other/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/overlays/ConfirmDropyOverlay';

const BACKGROUND_GEOLOC_ICON_OPENED_SIZE = 40;

const HomeScreen = ({ navigation, route }) => {
  const { dropyCreateParams = null } = route.params || {};

  const backgroundGeolocIconAnimatedValue = useRef(new Animated.Value(0)).current;

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
    outputRange: [BACKGROUND_GEOLOC_ICON_OPENED_SIZE, 210],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />

      <DropyMap
        retrievedDropies={retrievedDropies}
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
                <MaterialCommunityIcons
                  name='radar' size={BACKGROUND_GEOLOC_ICON_OPENED_SIZE - 10}
                  color={backgroundGeolocationEnabled ? Colors.mainBlue : Colors.grey}
                />
                <Text allowFontScaling={false} style={styles.backgroundGeolocationText}>
                  Mode radar {backgroundGeolocationEnabled ? 'activé' : 'desactivé'}
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
      />

      <ConfirmDropyOverlay
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
    backgroundColor: Colors.white,
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
