import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import Styles, { Colors, Fonts } from '../styles/Styles';

import DropyPopup from '../assets/svgs/dropyPopup.svg';

const createDropTimeString = (dropLifeTime) => {
  if (dropLifeTime < 60000) {
    return `${Math.floor(dropLifeTime / 1000)}s`;
  } else if (dropLifeTime < 3600000) {
    return `${Math.floor(dropLifeTime / 60000)}m`;
  } else if (dropLifeTime < 86400000) {
    return `${Math.floor(dropLifeTime / 3600000)}h`;
  } else if (dropLifeTime < 31536000000) {
    return `${Math.floor(dropLifeTime / 86400000)}d`;
  } else {
    return `${Math.floor(dropLifeTime / 31536000000)}y`;
  }
};

const DropyMapMarker = ({ dropy, onPress }) => {
  const [dropTimeString, setDropTimeString] = useState('0s');

  useEffect(() => {
    if(!dropy.isUserDropy) return;

    const dropTime = new Date(dropy.creationDate);
    const initialLifeTime = new Date() - dropTime;
    const intervalDuration = initialLifeTime < 60 * 1000 ? 1000 : 60 * 1000;

    const interval = setInterval(() => {
      const dropTime = new Date(dropy.creationDate);
      const dropLifeTime = new Date() - dropTime;
      setDropTimeString(createDropTimeString(dropLifeTime));
    }, intervalDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapView.Marker
      coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
      onPress={onPress}
    >
      <View style={styles.container}>
        <DropyPopup style={styles.svgBackground}></DropyPopup>
        {dropy.isUserDropy ? (
          <View style={styles.userDropyContainer}>
            <Text style={Fonts.bold(8, Colors.lightGrey)}>DROP</Text>
            <Text style={Fonts.bold(11, Colors.grey)}>{dropTimeString} ago</Text>
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

export default React.memo(DropyMapMarker, (prevProps, nextProps) => {
  return prevProps.dropy.id === nextProps.dropy.id;
});

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 100,
    ...Styles.center,
  },
  svgBackground: {
    ...Styles.blueShadow,
    position: 'absolute',
    top: 0,
  },
  userDropyContainer: {
    ...Styles.center,
    width: '60%',
  },
  markerButton: {
    width: '60%',
    backgroundColor: Colors.mainBlue,
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 6,
    ...Styles.center,
  },
});
