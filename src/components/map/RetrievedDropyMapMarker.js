import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import Styles, { Colors } from '../../styles/Styles';
import DropyMediaViewer from '../other/DropyMediaViewer';
import MEDIA_TYPES from '../../utils/mediaTypes';


const RetrievedDropyMapMarker = ({ dropy, onPress }) => {
  const [boxSize, setBoxSize] = useState(null);

  useEffect(() => {
    switch (dropy.mediaType) {
      case MEDIA_TYPES.PICTURE:
        setBoxSize(100);
        break;
      case MEDIA_TYPES.TEXT:
        setBoxSize(200);
        break;
      default:
        break;
    }
  }, []);

  return (
    <Marker
      coordinate={{ latitude: dropy.latitude, longitude: dropy.longitude }}
      onPress={onPress}
      tracksViewChanges={true}
    >
      <View style={{ ...styles.container, width: boxSize + 50, height: boxSize + 50 }}>
        <View style={{ ...styles.visibleContainer, width: boxSize, height: boxSize }}>
          <View style={styles.mediaContainer}>
            <DropyMediaViewer dropy={dropy} />
          </View>
        </View>
      </View>
    </Marker>
  );
};

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
