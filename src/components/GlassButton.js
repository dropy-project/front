import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';

import Svg1 from '../assets/svgs/rectangle_button_1.svg';
import Svg2 from '../assets/svgs/rectangle_button_2.svg';

const LargeRectangleButton = ({ onPress, buttonText, style, disabled }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.container, ...style }} >
    <Svg1 width={'100%'} height={'100%'} style={{ ...styles.svg }} />
    <Svg2 width={'100%'} height={'100%'} style={{ ...styles.svg, left: '-17%' }} />
    <Text style={{ ...Fonts.bold(27, Colors.white), letterSpacing: 7 }}>{buttonText}</Text>
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
