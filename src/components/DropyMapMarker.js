import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Styles, { Colors, Fonts } from '../styles/Styles';

const DropyMapMarker = ({ dropy, onPress }) => {

  return (
    <MapView.Marker
      coordinate={{
        latitude: dropy.latitude,
        longitude: dropy.longitude
      }}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.markerContainer}>
          <View style={styles.markerButton}>
            <Text style={styles.markerText}>PICK UP</Text>
          </View>
        </View>
      </View>
    </MapView.Marker>
  );
};

export default DropyMapMarker;

const styles = StyleSheet.create({
  container: {
    padding: 100,
    ...Styles.center
  },
  markerContainer: {
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
    padding: 7,
    borderRadius: 15
  },
  markerButton: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 7
  },
  markerText: {
    color: Colors.white,
    ...Fonts.bold(12, Colors.white)
  }
});
