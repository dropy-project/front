import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

import mapStyle from '../assets/mapStyle.json';
import Styles, { Colors } from '../styles/Styles';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import useCurrentUser from '../hooks/useCurrentUser';
import GlassCircleButton from '../components/GlassCircleButton';
import ConfirmDropOverlay from '../components/ConfirmDropOverlay';
import DropyMapMarker from '../components/DropyMapMarker';

import useGeolocation from '../hooks/useGeolocation';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';
import useTravelDistanceCallback from '../hooks/useTravelDistanceCallback';

import API from '../services/API';

const HomeScreen = ({ navigation, route }) => {

  const { dropyCreateParams = null } = route.params || {};

  const mapRef = useRef(null);

  const [confirmDropOverlayVisible, setConfirmDropOverlayVisible] = useState(false);
  const [dropiesAround, setDropiesAround] = useState([]);

  const { userCoordinates } = useGeolocation();
  const { user } = useCurrentUser();

  useMapViewSyncronizer(mapRef);

  useTravelDistanceCallback(() => fetchDropiesAround(), 60);

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
      console.log(error?.response?.data || error);
    }
  };

  const lootMedia = async (dropy) => {
    try {
      if (userCoordinates == null) return;
      await API.retrieveDropy(user.id, dropy.id);
    } catch (error) {
      console.log(error?.response?.data);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => lootMedia(dropy)} />
        ))}
      </MapView>
      <GlassCircleButton disabled size={15} />
      <HomeScreenTabBar />
      <ConfirmDropOverlay
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
});
