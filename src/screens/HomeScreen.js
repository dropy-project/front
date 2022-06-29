import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  StatusBar,
  Platform
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Styles, { Colors } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import useCurrentUser from '../hooks/useCurrentUser';
import ConfirmDropOverlay from '../components/ConfirmDropOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';
import useTravelDistanceCallback from '../hooks/useTravelDistanceCallback';

import API from '../services/API';
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import Sonar from '../components/Sonar';
import Haptics from '../utils/haptics';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const mapRef = useRef(null);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);
  const [dropiesAround, setDropiesAround] = useState([]);

  const { userCoordinates } = useGeolocation();
  const { user } = useCurrentUser();

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
      const result = await API.getDropiesAround(user.id, userCoordinates.latitude, userCoordinates.longitude);
      setDropiesAround(result.data ?? []);
    } catch (error) {
      console.log('fetchDropiesError', error?.response?.data || error);
    }
  };

  const retreiveDropy = async (dropy) => {
    Haptics.impactHeavy();
    try {
      if (userCoordinates == null) return;
      if (dropy.isUserDropy) return;
      await API.retrieveDropy(user.id, dropy.id);
      const result = await API.getDropy(dropy.id);
      fetchDropiesAround();
      navigation.navigate('GetDropy', { dropy: result.data });
    } catch (error) {
      console.log(error?.response?.data);
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
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => retreiveDropy(dropy)} />
        ))}
      </MapView>
      <Sonar />
      <HomeScreenTabBar />
      <ConfirmDropOverlay
        dropyCreateParams={dropyCreateParams}
        visible={confirmDropOverlayVisible}
        onCloseOverlay={closeConfirmDropOverlay}
      />
      <ToggleBackgroundGeolocation />
    </View>
  );
};

export default HomeScreen;

// TEMPORARY
const ToggleBackgroundGeolocation = () => {
  const { backgroundGeolocationEnabled, setBackgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);
  return (
    <View style={{ position: 'absolute', top: '10%', flexDirection: 'row', alignItems: 'center' }}>
      <Text>Background Geolocation [ {backgroundGeolocationEnabled ? 'ON' : 'OFF'} ]  </Text>
      <Switch value={backgroundGeolocationEnabled} onValueChange={setBackgroundGeolocationEnabled}></Switch>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
  },
});
