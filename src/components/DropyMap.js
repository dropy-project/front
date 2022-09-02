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

import { coordinatesDistance } from '../utils/coordinates';
import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import Sonar from './Sonar';
import DropyMapMarker from './DropyMapMarker';
import DebugText from './DebugText';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';

const INITIAL_PITCH = 10;
const INITIAL_ZOOM = 17;
const MUSEUM_ZOOM = 13;

const DropyMap = ({ dropiesAround, retrieveDropy, museumVisible, selectedDropyIndex = null, retrievedDropies = null }) => {

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
  }, [userCoordinates, compassHeading, mapIsReady, museumVisible, selectedDropyIndex]);

  const setMapCameraPosition = async () => {
    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera == null) return;

    let position = userCoordinates;
    if(retrievedDropies != null && selectedDropyIndex != null && retrievedDropies[selectedDropyIndex] != null) {
      position = {
        latitude: retrievedDropies[selectedDropyIndex].latitude,
        longitude: retrievedDropies[selectedDropyIndex].longitude,
      };
    }

    const distanceBetweenCameraAndPosition = coordinatesDistance(currentCamera.center, position);
    const duration = 2000 - Math.min(distanceBetweenCameraAndPosition, 1500);

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          pitch: museumVisible ? 45 : INITIAL_PITCH,
          heading: compassHeading,
          zoom: museumVisible ? MUSEUM_ZOOM : INITIAL_ZOOM,
        },
        { duration: museumVisible ? 500 : duration }
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
        {retrievedDropies != null ? (
          <>
            {retrievedDropies[selectedDropyIndex ?? 0] != null && (
              <RetrievedDropyMapMarker
                key={retrievedDropies[selectedDropyIndex ?? 0].id}
                dropy={retrievedDropies[selectedDropyIndex ?? 0]}
                onPress={() => navigation.navigate('DisplayDropyMedia', {
                  dropy: retrievedDropies[selectedDropyIndex ?? 0],
                  showBottomModal: false,
                })}
              />
            )}
          </>
        ) : (
          <>
            {dropiesAround.map((dropy) => (
              <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => handleDropyPressed(dropy)} />
            ))}
          </>
        )}
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
