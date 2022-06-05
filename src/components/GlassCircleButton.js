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
      <Svg1 height={size * 1.5} width={size * 1.5} style={{ ...styles.svg, bottom: -size / 2.5 }} />
      <Svg2 height={size * 1.5} width={size * 1.5} style={{ ...styles.svg, top: -size / 2 }} />
      <Svg3 height={size * 1.5} width={size * 1.5} style={{ ...styles.svg, top: -size / 1.5 }} />
      {children}
    </View>
  </TouchableOpacity>
);

export default GlassCircleButton;

const styles = StyleSheet.create({
  container: {
    ...Styles.center,
    ...Styles.hardShadows,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowColor: Colors.purple1,
  },
  contentContainer: {
    borderRadius: 35,
    backgroundColor: '#7B6DCD',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position:'absolute',
    ...Styles.softShadows,
    shadowColor: Colors.purple1,
    shadowOpacity: 0.2,
  },
});
