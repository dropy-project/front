import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ProfileImage = (props) => {
  const { userId = null, displayName = null, displayNameSize = 20 } = props;

  const { user } = useCurrentUser();

  const [source, setSource] = useState(null);
  const [error, setError] = useState(false);

  const _displayName = displayName ?? user?.displayName ?? null;
  useEffect(() => {
    if(user == null) return;

    setError(false);
    setSource({
      uri: API.profilePictureUrl(userId != null ? userId : user.id),
      headers: API.getHeaders(),
      _date: Date.now(),
    });
  }, [user]);

  if(error) {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.purple3, ...Styles.center }}>
        {_displayName && (<Text style={{ ...Fonts.bold(displayNameSize, Colors.white) }}>{_displayName.slice(0, 1).toUpperCase()}</Text>)}
      </View>
    );
  }

  return (
    <Image
      key={source?._date}
      source={source}
      onError={() => setError(true)}
      resizeMode='cover'
      style={{ width: '100%', height: '100%' }}
      {...props}
    />
  );
};

export default ProfileImage;
