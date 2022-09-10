import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';

const GlassButton = ({ children, onPress, buttonText, style, disabled, fontSize = 19 }) => (
  <TouchableOpacity disabled={disabled} onPress={onPress}  >
    <View style={{ ...styles.container, ...style, opacity: disabled ? 0.5 : 1 }}>
      {children == null ? (
        <Text style={{ ...Fonts.bold(fontSize, Colors.white), letterSpacing: 1, textAlign: 'center' }}>{buttonText}</Text>
      ) :
        children
      }
    </View>
  </TouchableOpacity>

);

export default GlassButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    backgroundColor: Colors.purple1,
    ...Styles.center,
    ...Styles.hardShadows,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 8 },
    shadowColor: Colors.purple1,
  },
});
