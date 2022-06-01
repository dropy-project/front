import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { StatusBar } from 'expo-status-bar';
import { launchImageLibrary } from 'react-native-image-picker';
import mapStyle from '../assets/mapStyle.json';
import Styles, { Colors } from '../styles/Styles';
import HomeScreenTabBar from '../components/HomeScreenTabBar';
import useCurrentUser from '../hooks/useCurrentUser';
import GlassCircleButton from '../components/GlassCircleButton';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';
import API from '../services/API';
import useGeolocation from '../hooks/useGeolocation';
import DropyMapMarker from '../components/DropyMapMarker';
import useTravelDistanceCallback from '../hooks/useTravelDistanceCallback';

const HomeScreen = () => {
  const mapRef = useRef(null);

  const [dropiesAround, setDropiesAround] = useState([]);

  const { userCoordinates } = useGeolocation();
  const { user } = useCurrentUser();

  useMapViewSyncronizer(mapRef);

  useTravelDistanceCallback(() => fetchDropiesAround(), 60);

  const addMedia = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo'
      });
      const dropy = await API.createDropy(user.id, userCoordinates.latitude, userCoordinates.longitude);
      const filePath = result.assets[0].uri;
      const mediaResult = await API.postDropyMediaFromPath(dropy.id, filePath, 'picture');

      fetchDropiesAround();
      console.log(mediaResult);
    } catch (error) {
      console.log('Erreur', error?.response?.data || error);
    }
  };

  const fetchDropiesAround = async () => {
    try {
      if(userCoordinates == null) return;
      const result = await API.getDropiesAround(user.id, userCoordinates.latitude, userCoordinates.longitude);
      console.log(result.data);
      setDropiesAround(result.data ?? []);
    } catch (error) {
      console.log(error?.response?.data || error);
    }
  };

  const lootMedia = (dropy) => {
    console.log('loot media', dropy);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
      >
        {dropiesAround.map((dropy) => (
          <DropyMapMarker key={dropy.id} dropy={dropy} onPress={() => lootMedia(dropy)}/>
        ))}
      </MapView>
      <GlassCircleButton disabled size={15} />
      <HomeScreenTabBar addMedia={addMedia} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows
  }
});
