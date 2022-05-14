import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Styles from '../styles/Styles';
import mapStyle from '../assets/mapStyle.json';

import HomeScreenTabBar from '../components/HomeScreenTabBar';
import GlassCircleButton from '../components/GlassCircleButton';
import useMapViewSyncronizer from '../hooks/useMapViewSyncronizer';

const HomeScreen = () => {
  const mapRef = useRef(null);

  const { userCoordinates, compassHeading } = useMapViewSyncronizer(mapRef);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={StyleSheet.absoluteFillObject}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
      />
      <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
        <GlassCircleButton disabled size={15} />
      </View>
      <HomeScreenTabBar />
      <DebugView userCoordinates={userCoordinates} compassHeading={compassHeading} />
    </View>
  );
};

const DebugView = ({ userCoordinates, compassHeading }) => {
  return (
    <View style={{ position: 'absolute', bottom: 200 }}>
      <Text>Latitude : {userCoordinates?.latitude}</Text>
      <Text>Longitude : {userCoordinates?.longitude}</Text>
      <Text>Compass : {compassHeading}</Text>
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
