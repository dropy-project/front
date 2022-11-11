import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileImage from './ProfileImage';

const ProfileAvatar = ({
  style,
  size = 80,
  showQuestionMark = false,
  showStatusDot,
  isUserOnline,
  statusDotStyle,
  avatarUrl,
  displayName,
  displayNameSize,
}) => (
  <View style={{
    ...styles.container,
    borderRadius: size / 2.7,
    borderWidth: size / 25,
    height: size,
    width: size,
    ...style,
  }}>
    <View style={{ ...styles.imageContainer, borderRadius: size / 3.4 }} >
      {showQuestionMark === true ? (
        <Text style={Fonts.bold(size / 3, Colors.white)}>?</Text>
      ) : (
        <ProfileImage
          displayNameSize={displayNameSize}
          avatarUrl={avatarUrl}
          displayName={displayName}
        />
      )}
    </View>
    {showStatusDot && (
      <View style={{
        ...styles.statusDot,
        backgroundColor: isUserOnline ? Colors.green : Colors.lightGrey,
        height: size / 4,
        width: size / 4,
        ...statusDotStyle,
      }}
      />
    )}
  </View>
);

export default ProfileAvatar;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
    ...Styles.hardShadows,
    borderColor: Colors.purple2,
    borderWidth: 3.4,
    padding: 3,
  },
  imageContainer: {
    backgroundColor: Colors.purple3,
    height: '100%',
    width: '100%',
    ...Styles.center,
    overflow: 'hidden',
  },
  statusDot: {
    ...Styles.blueShadow,
    borderColor: 'white',
    borderRadius: 16,
    borderWidth: 3,
    bottom: -5,
    position: 'absolute',
    right: -5,
  },
});
