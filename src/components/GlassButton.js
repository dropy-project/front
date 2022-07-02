/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';

import Svg1 from '../assets/svgs/rectangle_button_1.svg';
import Svg2 from '../assets/svgs/rectangle_button_2.svg';

const GlassButton = ({ onPress, buttonText, style, disabled, fontSize = 19 }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.container, ...style }} >
    <Svg1 width={'80%'} style={{ ...styles.svg, right: '-3%', top: '-35%' }} />
    <Svg2 width={'80%'} style={{ ...styles.svg, left: '-17%' }} />
    <Text style={{ ...Fonts.bold(fontSize, Colors.white), letterSpacing: 1, textAlign: 'center' }}>{buttonText}</Text>
  </TouchableOpacity>
);

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: Colors.purple1,
    overflow: 'hidden',
    ...Styles.center,
  },
  svg: {
    position: 'absolute',
  },
});
