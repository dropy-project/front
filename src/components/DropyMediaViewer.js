import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import MEDIA_TYPES from '../utils/mediaTypes';
import LoadingSpinner from './LoadingSpinner';

const DropyMediaViewer = ({ dropy, style = StyleSheet.absoluteFillObject }) => {

  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState(null);
  const [dropyText, setDropyText] = useState('');

  useEffect(() => {
    setLoading(true);
    switch (dropy.mediaType) {
    case MEDIA_TYPES.PICTURE:
      loadImageSource();
      break;
    case MEDIA_TYPES.TEXT:
      loadDropyText();
      break;
    }
  }, []);

  const loadImageSource = () => {
    setImageSource({
      uri: dropy.mediaUrl,
      headers: API.getHeaders(),
    });
  };

  const loadDropyText = async () => {
    const result = await API.getDropyMedia(dropy.id);
    setDropyText(result.data);
    setLoading(false);
  };

  if(dropy.mediaType === MEDIA_TYPES.PICTURE) {
    return (
      <View style={style}>
        {loading && (
          <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
            <LoadingSpinner />
          </View>
        )}
        <FastImage
          onLoadEnd={() => setLoading(false)}
          style={{ ...styles.displayImage }}
          source={imageSource}
        />
      </View>
    );
  }

  if (dropy.mediaType === MEDIA_TYPES.TEXT) {
    return (
      <ScrollView style={style} contentContainerStyle={styles.textContentContainer}>
        {loading && (
          <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
            <LoadingSpinner />
          </View>
        )}
        <Text style={styles.dropyText}>{dropyText}</Text>
      </ScrollView>
    );
  }

  console.error(`DropyMediaViewer unsupported dropy type ${dropy.mediaType}`);
  return null;
};

export default DropyMediaViewer;

const styles = StyleSheet.create({
  textContentContainer: {
    ...Styles.center,
    minHeight: '80%',
  },
  dropyText: {
    ...Fonts.bold(17, Colors.darkerGrey),
    marginHorizontal: responsiveWidth(7),
    textAlign: 'justify',
  },
  displayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
