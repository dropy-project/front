import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Styles, { Colors, Fonts } from '../styles/Styles';

import DropyPopup from '../assets/svgs/dropyPopup.svg';

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
        <DropyPopup style={styles.svgBackground}></DropyPopup>
        {dropy.isUserDropy ? (
          <View style={styles.userDropyContainer}>
            <Text style={Fonts.bold(8, Colors.lightGrey)}>DROP</Text>
            <Text style={Fonts.bold(11, Colors.grey)}>{getDropTimeString()} ago</Text>
          </View>
        ) : (
          <View style={styles.markerButton}>
            <Text style={Fonts.bold(10, Colors.white)}>PICK UP</Text>
          </View>
        )}
      </View>
    </MapView.Marker>
  );
};

export default DropyMapMarker;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 100,
    ...Styles.center
  },
  svgBackground: {
    ...Styles.blueShadow,
    position: 'absolute',
    top: 0
  },
  userDropyContainer: {
    ...Styles.center,
    width: '60%'
  },
  markerButton: {
    width: '60%',
    backgroundColor: Colors.mainBlue,
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 6,
    ...Styles.center
  }
});
