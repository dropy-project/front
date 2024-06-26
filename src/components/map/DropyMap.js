import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, SafeAreaView, StyleSheet } from 'react-native';

import { PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { PERMISSIONS, request, requestLocationAccuracy } from 'react-native-permissions';
import { Directions, Gesture, GestureDetector, TouchableOpacity } from 'react-native-gesture-handler';
import { useInitializedGeolocation } from '../../hooks/useGeolocation';

import Haptics from '../../utils/haptics';

import Styles, { Colors, Map } from '../../styles/Styles';
import useDropiesAroundSocket from '../../hooks/useDropiesAroundSocket';
import AnimatedFlask from '../effect/AnimatedFlask';
import MapLoadingOverlay from '../overlays/MapLoadingOverlay';
import DebugText from '../other/DebugText';
import FadeInWrapper from '../effect/FadeInWrapper';
import EnergyPopup from '../overlays/EnergyPopup';
import useOnAppFocused from '../../hooks/useOnAppFocused';
import useCurrentUser from '../../hooks/useCurrentUser';
import EnergyTooltip from './EnergyTooltip';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';
import Sonar from './Sonar';
import DropyMapMarker from './DropyMapMarker';
import MapDebugger from './MapDebugger';
import OSMapView from './OSMapView';

const hasLocationPermissions = async () => {
  let locationGranted = false;
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const accuracy = await requestLocationAccuracy({ purposeKey: 'LocationFullAccuracy' });
    locationGranted = result === 'granted' && accuracy === 'full';
  } else {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    locationGranted = result === 'granted';
  }
  return locationGranted;
};

const DropyMap = ({
  museumVisible,
  selectedDropyIndex = null,
  retrievedDropies = null,
  onSwipeMuseum = () => { },
}) => {
  const navigation = useNavigation();
  const {
    dropiesAround,
  } = useDropiesAroundSocket();

  const {
    userCoordinates,
    compassHeading,
    initialized: geolocationInitialized,
  } = useInitializedGeolocation();

  const { developerMode } = useCurrentUser();

  const sonarZoomAnimatedValue = useRef(new Animated.Value(Map.INITIAL_ZOOM)).current;
  const sonarHeadingAnimatedValue = useRef(new Animated.Value(compassHeading)).current;

  const mapHeadingValueRef = useRef(0);

  const [mapHasGesture, setMapHasGesture] = useState(false);

  const [headingLocked, setHeadingLocked] = useState(false);
  const [locationGranted, setLocationGranted] = useState(true);

  const osMap = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(false);

  const handleDropyPressed = async (dropy) => {
    if (dropy == null)
      return;
    if (userCoordinates == null)
      return;
    if (dropy?.isUserDropy)
      return;

    Haptics.impactHeavy();
    navigation.navigate('GetDropy', { dropy });
  };

  useEffect(() => {
    if (mapIsReady === false)
      return;
    if (osMap?.current?.getMapRef()?.getCamera() == null)
      return;
    if (userCoordinates == null)
      return;

    // During user gesture, map self positioning is disabled, this prevent
    // the camera to skip following user interaction which is frustrating for the user.
    // When the user release the gesture, the map is repositioned to the user position.
    if (mapHasGesture)
      return;

    setMapCameraPosition();
  }, [
    userCoordinates,
    compassHeading,
    mapIsReady,
    selectedDropyIndex,
    retrievedDropies,
    mapHasGesture
  ]);

  const setMapCameraPosition = async (forceHeading = false) => {
    const currentCamera = await osMap.current?.getMapRef()?.getCamera();
    if (currentCamera == null)
      return;

    let position = userCoordinates;
    if (retrievedDropies != null && selectedDropyIndex != null && retrievedDropies[selectedDropyIndex] != null) {
      position = {
        latitude: retrievedDropies[selectedDropyIndex].latitude,
        longitude: retrievedDropies[selectedDropyIndex].longitude,
      };
    }

    if (forceHeading) {
      Animated.timing(sonarHeadingAnimatedValue, {
        toValue: compassHeading,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      osMap.current?.getMapRef()?.animateCamera(
        {
          center: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          pitch: museumVisible ? Map.MUSEUM_PITCH : Map.INITIAL_PITCH,
          heading: headingLocked || forceHeading ? compassHeading : undefined,
          zoom: museumVisible ? Map.MUSEUM_ZOOM : undefined,
        },
        { duration: 200 }
      );
    });
  };

  const forceCameraToLockHeading = () => setMapCameraPosition(true);

  const toggleHeadingLock = () => setHeadingLocked((locked) => {
    const newLockedValue = !locked;
    if (newLockedValue)
      forceCameraToLockHeading();
    return newLockedValue;
  });

  useOnAppFocused(() => {
    hasLocationPermissions().then(setLocationGranted);
  });

  useEffect(() => {
    hasLocationPermissions().then(setLocationGranted);
  }, []);

  const onMapZoomChange = (zoom) => {
    // High frequency event, should not be used to update state
    sonarZoomAnimatedValue.setValue(zoom);
  };

  const onMapHeadingChange = (heading) => {
    // High frequency event, should not be used to update state
    mapHeadingValueRef.current = heading;
    sonarHeadingAnimatedValue.setValue(compassHeading - heading);
    if (headingLocked)
      setHeadingLocked(false);
  };

  useEffect(() => {
    const sonarHeading = headingLocked ? 0 : compassHeading - mapHeadingValueRef.current;
    sonarHeadingAnimatedValue.setValue(sonarHeading);
  }, [compassHeading, sonarHeadingAnimatedValue, headingLocked]);

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(onSwipeMuseum);

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => navigation.navigate('Conversations'));

  return (
    <>
      <GestureDetector gesture={Gesture.Race(flingRight, flingLeft)}>
        <OSMapView
          ref={osMap}
          provider={PROVIDER_GOOGLE}
          onZoomChange={onMapZoomChange}
          onHeadingChange={onMapHeadingChange}
          setHeadingLocked={setHeadingLocked}
          onGestureStart={() => setMapHasGesture(true)}
          onGestureEnd={() => setMapHasGesture(false)}
          style={StyleSheet.absoluteFillObject}
          zoomEnabled={Platform.OS === 'ios' && !museumVisible}
          minZoomLevel={developerMode ? Map.MIN_ZOOM_DEVELOPER : Map.MIN_ZOOM}
          maxZoomLevel={Map.MAX_ZOOM}
          scrollEnabled={false}
          pitchEnabled={false}
          showsCompass={false}
          moveOnMarkerPress={false}
          showsIndoors={false}
          showsBuildings={false}
          showsScale={false}
          showsPointsOfInterest={false}
          showsMyLocationButton={false}
          zoomTapEnabled={false}
          zoomControlEnabled={false}
          toolbarEnabled={false}
          // Below fix for https://github.com/dropy-project/front/issues/411 (Tap on map moves camera)
          onPress={() => Platform.OS === 'android' && setMapCameraPosition()}
          initialCamera={{
            center: {
              latitude: userCoordinates?.latitude ?? 0,
              longitude: userCoordinates?.longitude ?? 0,
            },
            heading: compassHeading || 0,
            pitch: Map.INITIAL_PITCH,
            zoom: Map.INITIAL_ZOOM,
            altitude: 0,
          }}
          onMapLoaded={() => setMapIsReady(true)}
        >
          {retrievedDropies == null ? (
            <>
              {dropiesAround.map((dropy) => (
                <DropyMapMarker
                  key={`${dropy.id}_${dropy.reachable}`}
                  dropy={dropy}
                  onPress={() => handleDropyPressed(dropy)}
                />
              ))}
            </>
          ) : (
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
          )}
          {developerMode && <MapDebugger userCoordinates={userCoordinates} />}
        </OSMapView>
      </GestureDetector>

      <EnergyPopup />
      <Sonar
        zoomAnimatedValue={sonarZoomAnimatedValue}
        headingAnimatedValue={sonarHeadingAnimatedValue}
        visible={!museumVisible}
        compassHeading={compassHeading}
      />
      <MapLoadingOverlay visible={geolocationInitialized === false} isGeolocationPermissionGranted={locationGranted} />
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}
        start={{ x: 0.5, y: 0.8 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <DebugText marginBottom={100}>{JSON.stringify(userCoordinates, null, 2)}</DebugText>
      <DebugText marginBottom={300}>{JSON.stringify(dropiesAround, null, 2)}</DebugText>

      <SafeAreaView style={styles.controlsView}>
        <FadeInWrapper visible={!museumVisible}>
          <EnergyTooltip>
            <AnimatedFlask />
          </EnergyTooltip>
          <TouchableOpacity onPress={toggleHeadingLock} style={styles.lockButton}>
            {headingLocked ? (
              <FontAwesome5 name='compass' size={20} color={Colors.darkGrey} />
            ) : (
              <FontAwesome
                style={{ transform: [{ translateX: -0.5 }, { translateY: -0.5 }] }}
                name='location-arrow'
                size={20}
                color={Colors.darkGrey}
              />
            )}
          </TouchableOpacity>
        </FadeInWrapper>
      </SafeAreaView>
    </>
  );
};

export default DropyMap;

const styles = StyleSheet.create({
  controlsView: {
    ...Styles.safeAreaView,
    position: 'absolute',
    bottom: 130,
    right: 20,
    flexDirection: 'row-reverse',
  },
  lockButton: {
    marginTop: 15,
    backgroundColor: Colors.white,
    borderRadius: 100,
    padding: 11,
    width: 43,
    height: 43,
    ...Styles.center,
    ...Styles.softShadows,
  },
});
