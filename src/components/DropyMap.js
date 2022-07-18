import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import useMapViewSyncronizer, { INITIAL_PITCH, INITIAL_ZOOM } from '../hooks/useMapViewSyncronizer';
import useGeolocation from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import API from '../services/API';
import Haptics from '../utils/haptics';


import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import Sonar from './Sonar';
import DropyMapMarker from './DropyMapMarker';

const DropyMap = ({ dropiesAround, retrieveDropy }) => {

  const navigation = useNavigation();

  const { sendBottomAlert } = useOverlay();
  const { userCoordinates, compassHeading } = useGeolocation();

  const handleDropyPressed = async (dropy) => {
    Haptics.impactHeavy();
    try {
      if(dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

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
  useMapViewSyncronizer(mapRef, mapIsReady);

  useEffect(() => {
    if(Platform.OS === 'ios') {
      setTimeout(() => {
        setMapIsReady(true);
        console.log('MAP READY SKETCHY OVERRIDE');
        // REMOVE THIS WHEN FIXED IN MAPVIEW
        // Upgrade rn-maps to 1.0.0 and then check if this is fixed
        // https://github.com/react-native-maps/react-native-maps/issues/4319
      }, 2000);
    }
  }, []);

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={Platform.OS === 'ios' ? mapStyleIOS : mapStyleAndroid}
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
        onMapReady={() => setMapIsReady(true)}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => handleDropyPressed(dropy)} />
        ))}
      </MapView>
      <Sonar />
      <MapLoadingOverlay visible={userCoordinates == null} />
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}
        start={{ x: 0.5, y: 0.8 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
    </>
  );
};

export default DropyMap;
