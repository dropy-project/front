import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FooterConfirmation from '../components/FooterConfirmation';
import GoBackHeader from '../components/GoBackHeader';
import MEDIA_TYPES from '../utils/mediaTypes';


import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const GetDropyScreen = ({ navigation, route }) => {
  const { dropy = '' } = route.params || {};

  const [imageSource, setImageSource] = useState(null);
  const [dropyText, setDropyText] = useState('');

  useEffect(() => {
    switch (dropy.mediaType) {
    case MEDIA_TYPES.IMAGE:
      loadImageSource();
      break;
    case MEDIA_TYPES.TEXT:
      loadDropyText();
      break;
    }
  }, []);

  const loadImageSource = () => {
    let authHeader = API.getHeaders()['Authorization'];
    if (Array.isArray(authHeader)) {
      authHeader = authHeader[0];
    }
    const headers = { Authorization: authHeader };
    setImageSource({
      uri: `https://api.dropy-app.com/dropy/${dropy.id}/media`,
      headers,
    });
  };

  const loadDropyText = async () => {
    const result = await API.getDropyMedia(dropy.id);
    setDropyText(result.data);
  };


  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      {dropy.mediaType === MEDIA_TYPES.PICTURE ? (
        <>
          <Image
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
            source={imageSource}
          ></Image>
        </>
      ) : (
        <ScrollView style={styles.textContainer} contentContainerStyle={styles.textContentContainer}>
          <Text style={styles.dropyText}>{dropyText}</Text>
        </ScrollView>
      )}
      <FooterConfirmation dropy={dropy} nextPage={'Chat'} />
    </SafeAreaView>
  );
};

export default GetDropyScreen;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  textContentContainer: {
    ...Styles.center,
    minHeight: '80%',
  },
  dropyText: {
    ...Fonts.bold(17, Colors.darkerGrey),
    marginHorizontal: responsiveWidth(7),
    textAlign: 'justify',
  },
});
