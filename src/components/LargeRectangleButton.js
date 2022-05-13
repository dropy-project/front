import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';

import Svg1 from '../assets/svgs/rectangle_button_1.svg';
import Svg2 from '../assets/svgs/rectangle_button_2.svg';

const LargeRectangleButton = ({ onPress, buttonText, style }) => (
  <TouchableOpacity onPress={onPress} style={{ ...styles.container, ...style }} >
    <Svg1 width={'100%'} height={'100%'} style={{ ...styles.svg }} />
    <Svg2 width={'100%'} height={'100%'} style={{ ...styles.svg }} />
    <Text style={{ ...Fonts.bold(34, Colors.white), letterSpacing: 12 }}>{buttonText}</Text>
  </TouchableOpacity>
);

export default LargeRectangleButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: Colors.purple1,
    overflow: 'hidden',
    ...Styles.center
  },
  svg: {
    position: 'absolute'
  }
});
