import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import Svg1 from '../assets/svgs/add_drop_1.svg';
import Svg2 from '../assets/svgs/add_drop_2.svg';
import Svg3 from '../assets/svgs/add_drop_3.svg';
import Styles, { Colors } from '../styles/Styles';

const GlassCircleButton = ({ style, children, onPress, size = 70 }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ ...styles.container, ...style }}
  >
    <View
      style={{ ...styles.contentContainer, width: size, height: size }}
    >
      <Svg1 height={size} width={size} style={{ ...styles.svg, top: size - 60 }} />
      <Svg2 height={size} width={size} style={{ ...styles.svg }} />
      <Svg3 height={size} width={size} style={{ ...styles.svg }} />
      {children}
    </View>
  </TouchableOpacity>
);

export default GlassCircleButton;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
    ...Styles.hardShadows,
    shadowColor: Colors.purple1
  },
  contentContainer: {
    borderRadius: 35,
    backgroundColor: '#7B6DCD',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  svg: {
    position:'absolute'
  }
});
