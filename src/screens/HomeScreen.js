import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  TouchableOpacity
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Styles, { Colors, Fonts } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';
import useTravelDistanceCallback from '../hooks/useTravelDistanceCallback';

import API from '../services/API';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import Sonar from '../components/Sonar';
import Haptics from '../utils/haptics';
import useOverlay from '../hooks/useOverlay';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const mapRef = useRef(null);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);
  const [dropiesAround, setDropiesAround] = useState([]);

  const { userCoordinates } = useGeolocation();
  const { sendBottomAlert } = useOverlay();

  useMapViewSyncronizer(mapRef);

  useTravelDistanceCallback(() => fetchDropiesAround(), 60, 15000);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDropiesAround();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if(dropyCreateParams != null) {
      setConfirmDropOverlayVisible(true);
    }
  }, []);

  const closeConfirmDropOverlay = () => {
    fetchDropiesAround();
    setConfirmDropOverlayVisible(false);
  };

  const fetchDropiesAround = async () => {
    try {
      if (userCoordinates == null) return;
      const result = await API.getDropiesAround(userCoordinates.latitude, userCoordinates.longitude);
      setDropiesAround(result.data ?? []);
    } catch (error) {
      console.log('fetchDropiesError', error?.response?.data || error);
    }
  };

  const retrieveDropy = async (dropy) => {
    Haptics.impactHeavy();
    try {
      if (userCoordinates == null) return;
      if (dropy.isUserDropy) return;
      const response = await API.retrieveDropy(dropy.id);
      console.log('Retreive dropy API response', response.data);
      const result = await API.getDropy(dropy.id);
      navigation.navigate('GetDropy', { dropy: result.data });
    } catch (error) {
      console.log('Retrieve dropy error', error?.response?.data ?? error);
      if(error.response.status === 403) {
        sendBottomAlert({
          title: 'Oh no!',
          description: 'Looks like someone took this drop before you...',
        });
      } else {
        sendBottomAlert({
          title: 'Oh no!',
          description: 'Looks like there has been an issue while collecting this drop...\nCheck your internet connection',
        });
      }
    } finally {
      fetchDropiesAround();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === 'ios' ? mapStyleIOS : mapStyleAndroid}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => retrieveDropy(dropy)} />
        ))}
      </MapView>
      <Sonar />
      <HomeScreenTabBar />
      <ToggleBackgroundGeolocation />
      <ConfirmDropyOverlay
        dropyCreateParams={dropyCreateParams}
        visible={confirmDropOverlayVisible}
        onCloseOverlay={closeConfirmDropOverlay}
      />
    </View>
  );
};

export default HomeScreen;

// TEMPORARY
const ToggleBackgroundGeolocation = () => {
  const { backgroundGeolocationEnabled, setBackgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);

  const { sendAlert } = useOverlay();

  const toggle = async () => {
    if (backgroundGeolocationEnabled) {
      const result = await sendAlert({
        title: 'Turn off background location',
        description: 'The app will not be able to tell you if there are drops around you.',
        denyText: 'keep enabled',
        validateText: 'TURN OFF',
      });
      if(!result) return;
      setBackgroundGeolocationEnabled(false);
    } else {
      const result = await sendAlert({
        title: 'Turn on background location',
        description: 'The app will send you notifications when you are near a drop, even if you are not using the app.',
        denyText: 'cancel',
        validateText: 'TURN ON',
      });
      if(!result) return;
      setBackgroundGeolocationEnabled(true);
    }
  };

  return (
    <TouchableOpacity style={{ position: 'absolute', top: '10%' }} onPress={toggle}>
      <View style={styles.toggleBackgroundGeolocButton}>
        <Text style={styles.toggleBackgroundGeolocButtonText}>
          {backgroundGeolocationEnabled ? 'Disable background geolocation' : 'Enable background geolocation'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
  },
  toggleBackgroundGeolocButton: {
    opacity: 0.8,
    alignItems: 'center',
    backgroundColor: Colors.mainBlue,
    ...Styles.hardShadows,
    ...Styles.center,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  toggleBackgroundGeolocButtonText: {
    ...Fonts.bold(12, Colors.white),
    textAlign: 'center',
  },
});
