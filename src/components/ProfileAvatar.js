import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Styles, { Colors, Fonts } from '../styles/Styles';

const ProfileAvatar = ({ style, size = 80, showQuestionMark = false, showStatusDot, isUserOnline, picture= '.' }) => {
  return (
    <View style={{ ...styles.container, width: size, height: size, borderRadius: size / 3, ...style }}>
      <View style={{ ...styles.imageContainer, borderRadius: size / 3.6 }} >
        {showQuestionMark ? (
          <Text style={Fonts.bold(size / 3, Colors.white)}>?</Text>
        ) : (
          <>{ /* TO DO profile picture */ }</>
        )}
      </View>
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
  },
});
