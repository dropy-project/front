import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
import Styles, { Colors, Fonts } from '../styles/Styles';

import DropyPopup from '../assets/svgs/dropyPopup.svg';

import { createDropTimeString } from '../utils/time';

const DropyMapMarker = ({ dropy, onPress }) => {
  const [dropTimeString, setDropTimeString] = useState('0s');

  useEffect(() => {
    if(!dropy.isUserDropy) return;

    const dropTime = new Date(dropy.creationDate);
    const initialLifeTime = new Date() - dropTime;
    const intervalDuration = initialLifeTime < 60 * 1000 ? 1000 : 60 * 1000;

    const updateTimeString = () => {
      const dropTime = new Date(dropy.creationDate);
      const dropLifeTime = new Date() - dropTime;
      setDropTimeString(createDropTimeString(dropLifeTime));
    };

    updateTimeString();
    const interval = setInterval(updateTimeString, intervalDuration);

    return () => clearInterval(interval);
  }, [dropy?.isUserDropy]);

  if(!dropy.reachable && !dropy?.isUserDropy) return <RadarMarker dropy={dropy} />;

  return (
    <Marker
      coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
      onPress={onPress}
      tracksViewChanges={dropy.isUserDropy}
    >
      <View style={styles.container}>
        <DropyPopup style={styles.svgBackground}></DropyPopup>
        {dropy.isUserDropy ? (
          <View style={styles.userDropyContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="clip"
              allowFontScaling={false}
              style={{ ...Fonts.bold(8, Colors.lightGrey), fontSize: 7 }}>
                DROP
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="clip"
              allowFontScaling={false}
              style={{ ...Fonts.bold(11, Colors.grey), fontSize: 12 }}>
              {dropTimeString} ago
            </Text>
          </View>
        ) : (
          <View style={styles.markerButton}>
            <Text
              numberOfLines={1}
              ellipsizeMode="clip"
              allowFontScaling={false}
              style={{ ...Fonts.bold(10, Colors.white), fontSize: 12 }}>
                PICK UP
            </Text>
          </View>
        )}
      </View>
    </Marker>
  );
};

// eslint-disable-next-line react/display-name
export default React.memo(DropyMapMarker, (prevProps, nextProps) => {
  return prevProps.dropy.id === nextProps.dropy.id;
});

const RadarMarker = ({ dropy }) => {
  return (
    <Marker
      coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
      tracksViewChanges={true}
    >
      <View style={{ ...Styles.center, width: 40, height: 40 }}>
        <View style={{
          width: 14,
          height: 14,
          borderRadius: 20,
          backgroundColor: Colors.white,
          ...Styles.center,
          ...Styles.hardShadows,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 },
        }}>
          <View style={{
            width: '60%',
            height: '60%',
            borderRadius: 5,
            backgroundColor: Colors.mainBlue,
          }} />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 100,
    ...Styles.center,
  },
  svgBackground: {
    ...(Platform.OS === 'ios' ?  Styles.blueShadow : ''),
    position: 'absolute',
    top: 0,
  },
  userDropyContainer: {
    ...Styles.center,
    width: '60%',
  },
  markerButton: {
    width: '60%',
    height: '35%',
    backgroundColor: Colors.mainBlue,
    borderRadius: 7,
    paddingVertical: 3,
    paddingHorizontal: 6,
    ...Styles.center,
  },
});
