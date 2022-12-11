import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import { PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useInitializedGeolocation } from '../../hooks/useGeolocation';
import useOverlay from '../../hooks/useOverlay';

import Haptics from '../../utils/haptics';

import useCurrentUser from '../../hooks/useCurrentUser';
import Styles, { Colors, Map } from '../../styles/Styles';
import AnimatedFlask from '../effect/AnimatedFlask';
import MapLoadingOverlay from '../overlays/MapLoadingOverlay';
import DebugText from '../other/DebugText';
import FadeInWrapper from '../effect/FadeInWrapper';
import EnergyPopup from '../overlays/EnergyPopup';
import useDropiesAroundSocket from '../../hooks/useDropiesAroundSocket';
import EnergyTooltip from './EnergyTooltip';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';
import Sonar from './Sonar';
import DropyMapMarker from './DropyMapMarker';
import MapDebugger from './MapDebugger';
import OSMapView from './OSMapView';

const DropyMap = ({
  museumVisible,
  selectedDropyIndex = null,
  retrievedDropies = null,
}) => {
  const navigation = useNavigation();

  const { sendBottomAlert, sendAlert } = useOverlay();

  const {
    dropiesAround,
    retrieveDropy,
  } = useDropiesAroundSocket();

  const {
    userCoordinates,
    compassHeading,
    initialized: geolocationInitialized,
  } = useInitializedGeolocation();

  const { developerMode, setUser } = useCurrentUser();

  const [currentZoom, setCurrentZoom] = useState(0);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [headingLocked, setHeadingLocked] = useState(false);

  const osMap = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(false);

  const handleDropyPressed = async (dropy) => {
    try {
      if (dropy == null)
        return;
      if (userCoordinates == null)
        return;
      if (dropy?.isUserDropy)
        return;

      Haptics.impactHeavy();

      const result = await retrieveDropy(dropy.id);
      if (result.error != null) {
        if (result.status === 406) {
          await sendAlert({
            title: 'Oh non, tu es à cours d'énergie !',
            description: 'N\'attends pas, recharge la en posant un drop !',
            validateText: 'Ok !',
          });
          return;
        }
        throw result.error;
      }

      navigation.navigate('GetDropy', { dropy: result.data.dropy });

      setTimeout(() => {
        setUser((oldUser) => ({
          ...oldUser,
          energy: result.data.newEnergy,
          lastEnergyIncrement: result.data.newEnergy - result.data.oldEnergy,
        }));
      }, 500);
    } catch (error) {
      console.error('Dropy pressed error', error);
      sendBottomAlert({
        title: 'Oups...',
        description: 'Le drop a été perdu en chemin\nVérifie ta connexion internet',
      });
    }
  };

  useEffect(() => {
    if (mapIsReady === false)
      return;
    if (osMap?.current?.getMapRef()?.getCamera() == null)
      return;
    if (userCoordinates == null)
      return;

    setMapCameraPosition();
  }, [
    userCoordinates,
    compassHeading,
    mapIsReady,
    selectedDropyIndex,
    retrievedDropies
  ]);

  const setMapCameraPosition = async (forceHeading = false, forceZoom = false) => {
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

    setCurrentZoom(forceZoom ? Map.MAX_ZOOM : currentCamera.zoom);
    setCurrentHeading(forceHeading ? compassHeading : currentCamera.heading);

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
          zoom: museumVisible ? Map.MUSEUM_ZOOM : (forceZoom ? Map.MAX_ZOOM : undefined),
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

  return (
    <>
      <OSMapView
        ref={osMap}
        provider={PROVIDER_GOOGLE}
        setCurrentZoom={setCurrentZoom}
        setCurrentHeading={setCurrentHeading}
        setHeadingLocked={setHeadingLocked}
        style={StyleSheet.absoluteFillObject}
        zoomEnabled={Platform.OS === 'ios' && !museumVisible}
        minZoomLevel={developerMode ? Map.MIN_ZOOM_DEVELOPER : Map.MIN_ZOOM}
        maxZoomLevel={Map.MAX_ZOOM}
        scrollEnabled={false}
        pitchEnabled={false}
        showsCompass={false}
        moveOnMarkerPress={false}
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
        showsPointsOfInterest={false}
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

      <SafeAreaView style={styles.controlsView}>
        <FadeInWrapper visible={!museumVisible}>
          <EnergyTooltip>
            <AnimatedFlask />
          </EnergyTooltip>
          <FadeInWrapper visible={currentZoom < Map.MAX_ZOOM - 0.1}>
            <TouchableOpacity
              onPress={() => setMapCameraPosition(headingLocked, true)}
              style={styles.lockButton}
            >
              <MaterialIcons name='my-location' size={20} color={Colors.darkGrey} />
            </TouchableOpacity>
          </FadeInWrapper>
          <TouchableOpacity onPress={toggleHeadingLock} style={styles.lockButton}>
            <FontAwesome5 name='compass' size={20} color={headingLocked ? Colors.darkGrey : Colors.lightGrey} />
          </TouchableOpacity>
        </FadeInWrapper>
      </SafeAreaView>

      <EnergyPopup />
      <Sonar zoom={currentZoom} heading={currentHeading} visible={!museumVisible} compassHeading={compassHeading} />
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
    ...Styles.center,
    ...Styles.softShadows,
  },
});
