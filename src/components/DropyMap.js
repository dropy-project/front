import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

import MapView, { Circle, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Geohash from 'ngeohash';

import { useNavigation } from '@react-navigation/native';
import { useInitializedGeolocation } from '../hooks/useGeolocation';
import useOverlay from '../hooks/useOverlay';

import mapStyleAndroid from '../assets/mapStyleAndroid.json';
import mapStyleIOS from '../assets/mapStyleIOS.json';

import API from '../services/API';
import Haptics from '../utils/haptics';

import useCurrentUser from '../hooks/useCurrentUser';
import { GEOHASH_SIZE } from '../states/GeolocationContextProvider';
import { coordinatesDistance } from '../utils/coordinates';
import { Map } from '../styles/Styles';
import MapLoadingOverlay from './overlays/MapLoadingOverlay';
import DropyMapMarker from './DropyMapMarker';
import DebugText from './DebugText';
import RetrievedDropyMapMarker from './RetrievedDropyMapMarker';
import Sonar from './Sonar';

const DropyMap = ({ dropiesAround, retrieveDropy, museumVisible, selectedDropyIndex = null, retrievedDropies = null }) => {

  const navigation = useNavigation();

  const { sendBottomAlert } = useOverlay();
  const { userCoordinates, compassHeading, initialized: geolocationInitialized } = useInitializedGeolocation();
  const { developerMode } = useCurrentUser();

  const [zoomValue, setZoomValue] = useState(Map.INITIAL_ZOOM);

  const mapRef = useRef(null);
  const [mapIsReady, setMapIsReady] = useState(false);

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

  useEffect(() => {
    if(mapIsReady === false) return;
    if(mapRef?.current == null) return;
    if (userCoordinates == null) return;

    setMapCameraPosition();
  }, [userCoordinates, compassHeading, mapIsReady, selectedDropyIndex, retrievedDropies]);

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
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: position.latitude,
            longitude: position.longitude,
          },
          pitch: museumVisible ? Map.MUSEUM_PITCH : Map.INITIAL_PITCH,
          heading: compassHeading,
          zoom: museumVisible ? Map.MUSEUM_ZOOM : zoomValue,
        },
        { duration: museumVisible ? 500 : duration }
      );
    });
  };

  const onRegionChange = (region) => {
    if(museumVisible) return;
    const zoom = Math.log2(360 * (Dimensions.get('screen').width / 256 / region.longitudeDelta));
    setZoomValue(zoom);
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
        zoomEnabled={!museumVisible}
        minZoomLevel={developerMode ? Map.MIN_ZOOM_DEVELOPER : Map.MIN_ZOOM}
        maxZoomLevel={Map.MAX_ZOOM}
        showsCompass={false}
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
        cacheEnabled
        onRegionChange={onRegionChange}
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
      <Sonar zoomValue={zoomValue} visible={!museumVisible} />
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
