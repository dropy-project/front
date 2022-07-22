import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';
import MEDIA_TYPES from '../utils/mediaTypes';
import LoadingSpinner from './LoadingSpinner';

const DropyMediaViewer = ({ id, mediaType, style = StyleSheet.absoluteFillObject }) => {

  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState(null);
  const [dropyText, setDropyText] = useState('');

  useEffect(() => {
    setLoading(true);
    switch (mediaType) {
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
      uri: API.dropyMediaUrl(id),
      headers: API.getHeaders(),
    });
  };

  const loadDropyText = async () => {
    const result = await API.getDropyMedia(id);
    setDropyText(result.data);
    setLoading(false);
  };

  if(mediaType === MEDIA_TYPES.PICTURE) {
    return (
      <View style={style}>
        {loading && (
          <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
            <LoadingSpinner />
          </View>
        )}
        <Image
          onLoadEnd={() => setLoading(false)}
          style={{ ...styles.displayImage }}
          source={imageSource}
        ></Image>
      </View>
    );
  }

  if (mediaType === MEDIA_TYPES.TEXT) {
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

  console.error(`DropyMediaViewer unsupported dropy type ${mediaType}`);
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
