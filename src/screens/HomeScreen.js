import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Styles from '../styles/Styles';
import HomeScreenTabBar from '../components/HomeScreenTabBar';

import mapStyle from '../assets/mapStyle.json';
import GlassCircleButton from '../components/GlassCircleButton';

const HomeScreen = () => {

  const mapRef = useRef(null);

  const setMapCameraPosition = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: 44.84521905626495,
        longitude: -0.5712756393745136
      },
      pitch: 10,
      heading: -10,
      zoom: 17
    }, { duration: 1000 });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 44.84521905626495,
          longitude: -0.5712756393745136,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
        customMapStyle={mapStyle}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        onMapLoaded={setMapCameraPosition}
      />
      <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
        <GlassCircleButton disabled size={15} />
      </View>
      <HomeScreenTabBar />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Styles.center,
    ...Styles.hardShadows
  }
});
