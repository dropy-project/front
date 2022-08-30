import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ProfileImage = (props) => {

  const { user: localUser } = useCurrentUser();
  const {
    avatarUrl = localUser.avatarUrl,
    displayName = localUser.displayName,
    displayNameSize = 20,
  } = props;

  const [source, setSource] = useState(null);

  useEffect(() => {
    setSource({
      uri: avatarUrl,
      headers: API.getHeaders(),
    });
  }, [avatarUrl]);

  if(source == null) {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.purple3, ...Styles.center }}>
        {displayName && (<Text style={{ ...Fonts.bold(displayNameSize, Colors.white) }}>{displayName.slice(0, 1).toUpperCase()}</Text>)}
      </View>
    );
  }

  return (
    <FastImage
      source={source}
      onError={() => setSource(null)}
      resizeMode='cover'
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};

export default ProfileImage;
