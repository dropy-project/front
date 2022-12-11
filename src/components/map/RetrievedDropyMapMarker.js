import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import Styles, { Colors } from '../../styles/Styles';
import DropyMediaViewer from '../other/DropyMediaViewer';
import MEDIA_TYPES from '../../utils/mediaTypes';


const RetrievedDropyMapMarker = ({ dropy, onPress }) => (
  <Marker
    coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
    onPress={onPress}
    tracksViewChanges={true}
  >
    <View style={{ ...styles.container, width: (dropy.mediaType === MEDIA_TYPES.TEXT ? 250 : 150), height: (dropy.mediaType === MEDIA_TYPES.TEXT ? 250 : 150) }}>
      <View style={{ ...styles.visibleContainer, width: (dropy.mediaType === MEDIA_TYPES.TEXT ? 200 : 100), height: (dropy.mediaType === MEDIA_TYPES.TEXT ? 200 : 100) }}>
        <View style={styles.mediaContainer}>
          <DropyMediaViewer dropy={dropy} />
        </View>
      </View>
    </View>
  </Marker>
);

export default RetrievedDropyMapMarker;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
  },
  visibleContainer: {
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
