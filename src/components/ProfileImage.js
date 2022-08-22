import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ProfileImage = (props) => {
  const { userId = null, displayName = null, displayNameSize = 20 } = props;

  const { user } = useCurrentUser();

  const [source, setSource] = useState(null);
  const refreshCount = useRef(0);

  const _displayName = displayName ?? user?.displayName ?? null;

  useEffect(() => {
    if(user == null) return;
    setSource({
      uri: API.profilePictureUrl(userId != null ? userId : user.id),
      headers: API.getHeaders(),
      refreshCount: ++refreshCount.current,
    });
  }, [user]);

  if(source == null) {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.purple3, ...Styles.center }}>
        {_displayName && (<Text style={{ ...Fonts.bold(displayNameSize, Colors.white) }}>{_displayName.slice(0, 1).toUpperCase()}</Text>)}
      </View>
    );
  }

  return (
    <FastImage
      key={refreshCount.current}
      source={source}
      onError={() => setSource(null)}
      resizeMode='cover'
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};

export default ProfileImage;
