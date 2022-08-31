import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

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
}) => {
  return (
    <View style={{
      ...styles.container,
      borderWidth: size / 25,
      width: size,
      height: size,
      borderRadius: size / 2.7,
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
          width: size / 4,
          height: size / 4,
          backgroundColor: isUserOnline ? Colors.green : Colors.lightGrey,
          ...statusDotStyle,
        }}
        />
      )}
    </View>
  );
};

export default ProfileAvatar;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
    ...Styles.hardShadows,
    borderWidth: 3.4,
    borderColor: Colors.purple2,
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
    borderRadius: 16,
    borderColor: 'white',
    borderWidth: 3,
    bottom: -5,
    right: -5,
    position: 'absolute',
  },
});
