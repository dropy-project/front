import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, SafeAreaView } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Geohash from 'ngeohash';

import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import MapView, { Circle, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { useInitializedGeolocation } from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import Haptics from '../utils/haptics';

import useCurrentUser from '../hooks/useCurrentUser';
import { GEOHASH_SIZE } from '../states/GeolocationContextProvider';
import Styles, { Colors, Map } from '../styles/Styles';
import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import DropyMapMarker from './DropyMapMarker';
import DebugText from './DebugText';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';
import Sonar from './Sonar';
import FadeInWrapper from './FadeInWrapper';

const MAP_ROTATION_UNLOCK_HEADING_DEGREE_THRESHOLD = 5;

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

  return (
    <>
      <MapboxGL.MapView style={StyleSheet.absoluteFillObject}
        logoEnabled={false}
        compassEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        zoomEnabled
        rotateEnabled
        styleURL='mapbox://styles/dropy/cl8afrx4z000y15tb5fiyr2s9'
        onDidFinishRenderingMapFully={() => setMapIsReady(true)}
        onRegionDidChange={(data) => {
          setShowZoomButton(data.properties.zoomLevel < Map.MAX_ZOOM - 0.1);
          setCameraData(data.properties);
        }}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          followUserLocation
          followUserMode={headingLocked ? 'compass' : 'normal'}
          defaultSettings={{ zoomLevel: Map.INITIAL_ZOOM }}
          minZoomLevel={Map.MIN_ZOOM}
          maxZoomLevel={Map.MAX_ZOOM}
        />
      </MapboxGL.MapView>

      <SafeAreaView style={styles.avatarContainer}>
        <FadeInWrapper visible={!museumVisible}>
          <FadeInWrapper visible={showZoomButton}>
            <TouchableOpacity onPress={() => mapCameraRef.current.zoomTo(Map.MIN_ZOOM, 500)} style={styles.lockButton}>
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

const MapDebugger = ({ userCoordinates }) => {
  const [debugPolygons, setDebugPolygons] = useState([]);

  useEffect(() => {
    if(!userCoordinates) return;

    const polygons = [];
    for (const chunkInt of userCoordinates.geoHashs) {
      const [
        minlat,
        minlon,
        maxlat,
        maxlon
      ] = Geohash.decode_bbox_int(chunkInt, GEOHASH_SIZE);
      polygons.push([
        { latitude: minlat, longitude: minlon },
        { latitude: maxlat, longitude: minlon },
        { latitude: maxlat, longitude: maxlon },
        { latitude: minlat, longitude: maxlon }
      ]);
    }

    setDebugPolygons(polygons);
  }, [userCoordinates]);

  return (
    <>
      {debugPolygons.map((polygon, index) => (
        <React.Fragment key={index}>
          <Polygon
            coordinates={polygon}
            strokeColor='rgba(0,0,255,0.9)'
            fillColor='rgba(100,0,255,0.2)'
            strokeWidth={1}
          />
        </React.Fragment>
      ))}
      <Circle
        center={{
          latitude: userCoordinates?.latitude || 0,
          longitude: userCoordinates?.longitude || 0,
        }}
        radius={30}
      >
      </Circle>
    </>
  );
};

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



