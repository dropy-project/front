/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';


const GlassButton = ({ children, onPress, buttonText, style, disabled, fontSize = 19 }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress} style={{ ...styles.container, ...style }} >
    {children == null ? (
      <Text style={{ ...Fonts.bold(fontSize, Colors.white), letterSpacing: 1, textAlign: 'center' }}>{buttonText}</Text>
    ) :
      children
    }
  </TouchableOpacity>
);

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: Colors.purple1,
    overflow: 'hidden',
    ...Styles.center,
    ...Styles.hardShadows,
  },
});
