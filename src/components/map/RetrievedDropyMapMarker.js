import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import Styles, { Colors } from '../../styles/Styles';
import DropyMediaViewer from '../other/DropyMediaViewer';

const RetrievedDropyMapMarker = ({ dropy, onPress }) => (
  <Marker
    coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
    onPress={onPress}
    tracksViewChanges={true}
  >
    <View style={styles.container}>
      <View style={styles.visibleContainer}>
        <View style={styles.mediaContainer}>
          <DropyMediaViewer dropy={dropy} />
        </View>
      </View>
    </View>
  </Marker>
);

// eslint-disable-next-line react/display-name
export default RetrievedDropyMapMarker;

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: 150,
    ...Styles.center,
  },
  visibleContainer: {
    height: 100,
    width: 100,
    borderRadius: 24,
    backgroundColor: Colors.white,
    ...Styles.center,
    ...Styles.softShadows,
  },
  mediaContainer: {
    width: '90%',
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
});
