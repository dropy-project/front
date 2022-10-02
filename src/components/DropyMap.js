import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import { UserTrackingMode } from '@rnmapbox/maps/javascript/components/Camera';
import { useInitializedGeolocation } from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import Haptics from '../utils/haptics';

import useCurrentUser from '../hooks/useCurrentUser';
import Styles, { Colors, Map } from '../styles/Styles';
import mapStyle from '../assets/mapStyle.json';
import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import DebugText from './DebugText';
import Sonar from './Sonar';
import FadeInWrapper from './FadeInWrapper';


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

  const mapCameraRef = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(true);

  const handleDropyPressed = async (dropy) => {
    try {
      if (dropy == null) return;
      if (userCoordinates == null) return;
      if (dropy?.isUserDropy) return;

      Haptics.impactHeavy();

      const result = await retrieveDropy(dropy.id);
      if (result.error != null) {
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

  // console.log(headingLocked, compassHeading);

  return (
    <>
      <MapboxGL.MapView
        style={StyleSheet.absoluteFillObject}
        logoEnabled={false}
        compassEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        scaleBarEnabled={false}
        attributionEnabled={false}
        zoomEnabled
        rotateEnabled
        styleURL='mapbox://styles/dropy/cl8afrx4z000y15tb5fiyr2s9'
        onRegionIsChanging={(data) => {
          setShowZoomButton(data.properties.zoomLevel < Map.MAX_ZOOM - 0.1);
          setCameraData(data.properties);
        }}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          followUserMode={UserTrackingMode.Follow}
          followHeading={headingLocked ? compassHeading : undefined}
          centerCoordinate={[userCoordinates?.longitude, userCoordinates?.latitude]}
          defaultSettings={{ zoomLevel: Map.INITIAL_ZOOM }}
          minZoomLevel={Map.MIN_ZOOM}
          animationDuration={2000}
          animationMode="easeTo"
          maxZoomLevel={Map.MAX_ZOOM}
        />
      </MapboxGL.MapView>
      <SafeAreaView style={styles.avatarContainer}>
        <FadeInWrapper visible={!museumVisible}>
          <FadeInWrapper visible={showZoomButton}>
            <TouchableOpacity onPress={() => mapCameraRef.current.zoomTo(Map.MAX_ZOOM, 500)} style={styles.lockButton}>
              <MaterialIcons name="my-location" size={20} color={Colors.darkGrey} />
            </TouchableOpacity>
          </FadeInWrapper>
          <TouchableOpacity onPress={() => setHeadingLocked(old => !old)} style={styles.lockButton}>
            <FontAwesome5 name="compass" size={20} color={headingLocked ? Colors.darkGrey : Colors.lightGrey} />
          </TouchableOpacity>
        </FadeInWrapper>
      </SafeAreaView>

      <Sonar cameraData={cameraData} visible={!museumVisible} compassHeading={compassHeading} />

      <MapLoadingOverlay visible={!mapIsReady} />

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



