import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { useInitializedGeolocation } from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import API from '../services/API';
import Haptics from '../utils/haptics';

import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import Sonar from './Sonar';
import DropyMapMarker from './DropyMapMarker';
import DebugText from './DebugText';

const INITIAL_PITCH = 10;
const INITIAL_ZOOM = 17;
const MUSEUM_ZOOM = 10;

const DropyMap = ({ dropiesAround, retrieveDropy, museumVisible, selectedCoordinates = null }) => {

  const navigation = useNavigation();

  const { sendBottomAlert } = useOverlay();
  const { userCoordinates, compassHeading, initialized: geolocationInitialized } = useInitializedGeolocation();

  const handleDropyPressed = async (dropy) => {
    try {
      if(dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

      Haptics.impactHeavy();

      const response = await retrieveDropy(dropy.id);
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

  const mapRef = useRef(null);

  const [mapIsReady, setMapIsReady] = useState(false);

  useEffect(() => {
    if(mapIsReady === false) return;
    if(mapRef?.current == null) return;
    if (userCoordinates == null) return;

    setMapCameraPosition();
  }, [userCoordinates, compassHeading, mapIsReady, museumVisible, selectedCoordinates]);

  const setMapCameraPosition = async () => {
    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera == null) return;

    console.log('Current camera', selectedCoordinates);
    const position = selectedCoordinates ?? userCoordinates;

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          pitch: museumVisible ? 90 : INITIAL_PITCH,
          heading: compassHeading,
          zoom: museumVisible ? MUSEUM_ZOOM : INITIAL_ZOOM,
        },
        { duration: museumVisible ? 500 : 2000 }
      );
    });
  };

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === 'android' ? mapStyleAndroid : mapStyleIOS}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        showsCompass={false}
        initialCamera={{
          center: {
            latitude: userCoordinates?.latitude || 0,
            longitude: userCoordinates?.longitude || 0,
          },
          heading: compassHeading || 0,
          pitch: INITIAL_PITCH,
          zoom: INITIAL_ZOOM,
          altitude: 0,
        }}
        onMapLoaded={() => setMapIsReady(true)}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker  key={dropy.id} dropy={dropy} onPress={() => handleDropyPressed(dropy)} />
        ))}
      </MapView>
      <Sonar visible={!museumVisible} />
      <MapLoadingOverlay visible={geolocationInitialized === false} />
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}
        start={{ x: 0.5, y: 0.8 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <DebugText marginBottom={100}>{JSON.stringify(userCoordinates, null, 2)}</DebugText>
      <DebugText marginBottom={210}>{JSON.stringify(dropiesAround, null, 2)}</DebugText>
    </>
  );
};

export default DropyMap;
