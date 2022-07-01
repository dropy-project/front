import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import Styles, { Colors, Fonts } from '../styles/Styles';

const ProfileAvatar = ({ style, size = 80, showQuestionMark = false, showStatusDot, isUserOnline, pictureSRC }) => {
  return (
    <View style={{ ...styles.container, width: size, height: size, borderRadius: size / 3, ...style }}>
      <View style={{ ...styles.imageContainer, borderRadius: size / 3.6 }} >
        {pictureSRC && (
          <Image source={ pictureSRC } style={StyleSheet.absoluteFillObject} resizeMode={'cover'} />
        )}
        {showQuestionMark && (
          <Text style={Fonts.bold(size / 3, Colors.white)}>?</Text>
        )
        }
      </View>
      {showStatusDot && (
        <View style={{ ...styles.statusDot, backgroundColor: isUserOnline ? 'lightgreen' : 'grey' }} />
      )}
    </View>
  );
};

export default ProfileAvatar;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
    borderWidth: 4,
    borderColor: Colors.purple1,
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
    height: 20,
    width: 20,
    borderRadius: 16,
    borderColor: 'white',
    borderWidth: 3,
    bottom: -5,
    right: -5,
    position: 'absolute',

  },
});
