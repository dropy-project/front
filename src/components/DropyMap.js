import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, SafeAreaView } from 'react-native';

import MapView, {   PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useInitializedGeolocation } from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Haptics from '../utils/haptics';

import useCurrentUser from '../hooks/useCurrentUser';
import Styles, { Colors, Map } from '../styles/Styles';
import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import DropyMapMarker from './DropyMapMarker';
import DebugText from './DebugText';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';
import Sonar from './Sonar';
import FadeInWrapper from './FadeInWrapper';
import MapDebugger from './MapDebugger';

const MAP_ROTATION_UNLOCK_HEADING_DEGREE_THRESHOLD = 5;

const ANDROID_ZOOMS_PRESETS = [Map.MAX_ZOOM, Map.MIDDLE_ZOOM,  Map.MIN_ZOOM];

const DropyMap = ({ dropiesAround, retrieveDropy, museumVisible, selectedDropyIndex = null, retrievedDropies = null }) => {

  const navigation = useNavigation();

  const { sendBottomAlert } = useOverlay();
  const {
    userCoordinates,
    compassHeading,
    initialized: geolocationInitialized,
  } = useInitializedGeolocation();
  const { developerMode } = useCurrentUser();

  const [cameraData, setCameraData] = useState(null);
  const [headingLocked, setHeadingLocked] = useState(false);
  const [showZoomButton, setShowZoomButton] = useState(false);

  const [, setAndroidZoomPresetIndex] = useState(0);

  const mapRef = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(false);

  const handleDropyPressed = async (dropy) => {
    try {
      if(dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

      Haptics.impactHeavy();

      const result = await retrieveDropy(dropy.id);
      if(result.error != null) {
        throw result.error;
      }

      navigation.navigate('GetDropy', { dropy: result.data });

    } catch (error) {
      console.error('Dropy pressed error', error);
      sendBottomAlert({
        title: 'Oh no!',
        description: 'Looks like there has been an issue while collecting this drop...\nCheck your internet connection',
      });
    }
  };

  useEffect(() => {
    if(mapIsReady === false) return;
    if(mapRef?.current == null) return;
    if (userCoordinates == null) return;

    setMapCameraPosition();
  }, [userCoordinates, compassHeading, mapIsReady, selectedDropyIndex, retrievedDropies]);

  const setMapCameraPosition = async (forceHeading = false, forceZoom = false) => {
    const currentCamera = await mapRef.current?.getCamera();
    if (currentCamera == null) return;

    let position = userCoordinates;
    if(retrievedDropies != null && selectedDropyIndex != null && retrievedDropies[selectedDropyIndex] != null) {
      position = {
        latitude: retrievedDropies[selectedDropyIndex].latitude,
        longitude: retrievedDropies[selectedDropyIndex].longitude,
      };
    }

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          pitch: museumVisible ? Map.MUSEUM_PITCH : Map.INITIAL_PITCH,
          heading: headingLocked || forceHeading ? compassHeading : undefined,
          zoom: museumVisible ? Map.MUSEUM_ZOOM : (forceZoom ? Map.MAX_ZOOM : undefined),
        },
        { duration: 200 }
      );
    });
  };

  const onRegionChange = async () => {
    if(museumVisible) return;
    const camera = await mapRef.current.getCamera();
    setShowZoomButton(camera.zoom < Map.MAX_ZOOM - 0.1);
    setCameraData(camera);
  };

  const onPanDrag = async () => {
    if(museumVisible) return;
    const camera = await mapRef.current.getCamera();
    if(Math.abs(camera.heading - compassHeading) > MAP_ROTATION_UNLOCK_HEADING_DEGREE_THRESHOLD) {
      setHeadingLocked(false);
    }
  };

  const forceCameraToLockHeading = () => setMapCameraPosition(true);

  const toggleHeadingLock = () => setHeadingLocked(locked => {
    const newLockedValue = !locked;
    if(newLockedValue) forceCameraToLockHeading();
    return newLockedValue;
  });

  const zoomIn = () => {
    setAndroidZoomPresetIndex(index => {
      if(index === ANDROID_ZOOMS_PRESETS.length - 1) return index;
      mapRef.current?.animateCamera({ zoom: ANDROID_ZOOMS_PRESETS[index + 1] }, { duration: 200 });
      return index + 1;
    });
  };

  const zoomOut = () => {
    setAndroidZoomPresetIndex(index => {
      if(index === 0) return index;
      mapRef.current?.animateCamera({ zoom: ANDROID_ZOOMS_PRESETS[index - 1] }, { duration: 200 });
      return index - 1;
    });
  };

  const pinchGesture = Gesture.Pinch()
    .onEnd((e) => {
      if (e.velocity > 0) {
        zoomOut();
      }
      else {
        zoomIn();
      }
    });

  const Map = () => (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      customMapStyle={Platform.OS === 'android' ? mapStyleAndroid : mapStyleIOS}
      style={StyleSheet.absoluteFillObject}
      pitchEnabled={false}
      rotateEnabled={true}
      scrollEnabled={false}
      zoomEnabled={Platform.OS === 'ios' && !museumVisible}
      minZoomLevel={developerMode ? Map.MIN_ZOOM_DEVELOPER : Map.MIN_ZOOM}
      maxZoomLevel={Map.MAX_ZOOM}
      showsCompass={false}
      onPanDrag={onPanDrag}
      initialCamera={{
        center: {
          latitude: userCoordinates?.latitude || 0,
          longitude: userCoordinates?.longitude || 0,
        },
        heading: compassHeading || 0,
        pitch: Map.INITIAL_PITCH,
        zoom: Map.INITIAL_ZOOM,
        altitude: 0,
      }}
      onMapLoaded={() => setMapIsReady(true)}
      showsPointsOfInterest={false}
      onRegionChange={(region) => onRegionChange(region)}
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
            <DropyMapMarker
              key={`${dropy.id}_${dropy.reachable}`}
              dropy={dropy}
              onPress={() => handleDropyPressed(dropy)}
            />
          ))}
        </>
      )}
      {developerMode && <MapDebugger userCoordinates={userCoordinates} />}
    </MapView>
  );

  return (
    <>
      {Platform.OS === 'android' ? (
        <GestureDetector gesture={Gesture.Race(pinchGesture)}>
          <Map />
        </GestureDetector>
      ) : (
        <Map />
      )}

      <SafeAreaView style={styles.avatarContainer}>
        <FadeInWrapper visible={!museumVisible}>
          <FadeInWrapper visible={showZoomButton}>
            <TouchableOpacity onPress={() => setMapCameraPosition(headingLocked, true)} style={styles.lockButton}>
              <MaterialIcons name="my-location" size={20} color={Colors.darkGrey} />
            </TouchableOpacity>
          </FadeInWrapper>
          <TouchableOpacity onPress={toggleHeadingLock} style={styles.lockButton}>
            <FontAwesome5 name="compass" size={20} color={headingLocked ? Colors.darkGrey : Colors.lightGrey} />
          </TouchableOpacity>
        </FadeInWrapper>
      </SafeAreaView>

      <Sonar cameraData={cameraData} visible={!museumVisible} compassHeading={compassHeading} />
      <MapLoadingOverlay visible={geolocationInitialized === false} />
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}
        start={{ x: 0.5, y: 0.8 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <DebugText marginBottom={100}>{JSON.stringify(userCoordinates, null, 2)}</DebugText>
      <DebugText marginBottom={300}>{JSON.stringify(dropiesAround, null, 2)}</DebugText>
    </>
  );
};

export default DropyMap;

const styles = StyleSheet.create({
  avatarContainer: {
    ...Styles.safeAreaView,
    position: 'absolute',
    bottom: 130,
    width: '85%',
    flexDirection: 'row-reverse',
    padding: 30,
  },
  lockButton: {
    marginTop: 15,
    backgroundColor: Colors.white,
    borderRadius: 100,
    padding: 11,
    ...Styles.center,
    ...Styles.softShadows,
  },
});
