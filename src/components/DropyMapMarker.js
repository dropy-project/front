import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Styles, { Colors, Fonts } from '../styles/Styles';

const DropyMapMarker = ({ dropy, onPress }) => {

  const getDropTimeString = () => {
    const dropTime = new Date(dropy.creationDate);
    const dropTimeString = new Date() - dropTime;

    if (dropTimeString < 60000) {
      return `${Math.floor(dropTimeString / 1000)}s`;
    } else if (dropTimeString < 3600000) {
      return `${Math.floor(dropTimeString / 60000)}m`;
    } else if (dropTimeString < 86400000) {
      return `${Math.floor(dropTimeString / 3600000)}h`;
    } else if (dropTimeString < 31536000000) {
      return `${Math.floor(dropTimeString / 86400000)}d`;
    } else {
      return `${Math.floor(dropTimeString / 31536000000)}y`;
    }
  };

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
          {dropy.isUserDropy ? (
            <View style={styles.userDropyContainer}>
              <Text style={Fonts.bold(10, Colors.lightGrey)}>DROP</Text>
              <Text style={Fonts.bold(12, Colors.grey)}>{getDropTimeString()} ago</Text>
            </View>
          ) : (
            <View style={styles.markerButton}>
              <Text style={Fonts.bold(12, Colors.white)}>PICK UP</Text>
            </View>
          )}
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
  userDropyContainer: {
    ...Styles.center
  },
  markerContainer: {
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.hardShadows,
    padding: 7,
    borderRadius: 15,
    height: 40,
    width: 80
  },
  markerButton: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 7
  }
});
