import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Styles, { Colors } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import ConfirmDropyOverlay from '../components/ConfirmDropyOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer, { INITIAL_PITCH, INITIAL_ZOOM } from '../hooks/useMapViewSyncronizer';

import API from '../services/API';
import Sonar from '../components/Sonar';
import Haptics from '../utils/haptics';
import useOverlay from '../hooks/useOverlay';
import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';
import ProfileAvatar from '../components/ProfileAvatar';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const mapRef = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(false);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);

  const { userCoordinates, compassHeading } = useGeolocation();
  const { sendBottomAlert } = useOverlay();

  const { dropiesAround, createDropy, retreiveDropy } = useDropiesAroundSocket();

  useMapViewSyncronizer(mapRef, mapIsReady);

  useEffect(() => {
    if(dropyCreateParams != null) {
      setConfirmDropOverlayVisible(true);
    }
  }, []);

  const closeConfirmDropOverlay = () => {
    setConfirmDropOverlayVisible(false);
  };

  const handleDropyPressed = async (dropy) => {
    Haptics.impactHeavy();
    try {
      if(dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

      const response = await retreiveDropy(dropy.id);
      if(response.error != null) {
        throw response.error;
      }

      const result = await API.getDropy(dropy.id);
      navigation.navigate('GetDropy', { dropy: result.data });

    } catch (error) {
      console.error('Dropy pressed error', error);
      sendBottomAlert({
        title: 'Oh no!',
        description: 'Looks like there has been an issue while collecting this drop...\nCheck your internet connection',
      });
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
        initialCamera={Platform.OS === 'ios' ? undefined : {
          center: {
            latitude: userCoordinates?.latitude || 0,
            longitude: userCoordinates?.longitude || 0,
          },
          heading: compassHeading || 0,
          pitch: INITIAL_PITCH,
          zoom: INITIAL_ZOOM,
          altitude: 0,
        }}
        onMapReady={() => setMapIsReady(true)}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => handleDropyPressed(dropy)} />
        ))}
      </MapView>
      <Sonar />
      <SafeAreaView style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <ProfileAvatar
            size={70}
            onPress={() => navigation.navigate('Profile')}
          />
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
    position: 'absolute',
    top: 0,
    width: '90%',
  },
});
