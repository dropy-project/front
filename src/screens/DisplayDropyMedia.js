import React from 'react';
import { Image, Text, View } from 'react-native';
import FooterConfirmation from '../components/FooterConfirmation';
import GoBackHeader from '../components/GoBackHeader';
import MEDIA_TYPES from '../utils/mediaTypes';


import API from '../services/API';

const GetDropyScreen = ({ navigation, route }) => {
  const { dropy = '' } = route.params || {};

  return (
    <View>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      {dropy.mediaType === MEDIA_TYPES.PICTURE ? (
        <Image source={API.getDropyMedia(dropy.id)} />
      ) : (
        <Text>
          {API.getDropyMedia(dropy.id)}
        </Text>
      )}
      <FooterConfirmation dropy={dropy} nextPage={'Chat'} />
    </View>
  );
};

export default GetDropyScreen;

