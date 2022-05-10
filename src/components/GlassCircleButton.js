import React, { View } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import Svg1 from '../assets/svgs/add_drop_1.svg';
import Svg2 from '../assets/svgs/add_drop_2.svg';
import Svg3 from '../assets/svgs/add_drop_3.svg';

const GlassCircleButton = ({ children, onPress, size = 70 }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.container}
  >
    <View
      style={{ ...styles.contentContainer, width: size, height: size }}
    >
      <Svg1 height={size} width={size} style={{ position: 'absolute', top: 10 }} />
      <Svg2 height={size} width={size} style={{ position: 'absolute', top: 10 }} />
      <Svg3 height={size} width={size} style={{ position: 'absolute', top: 10 }} />
      {children}
    </View>
  </TouchableOpacity>
);

export default GlassCircleButton;

const styles = StyleSheet.create({
  container: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    ...styles.shadow
  },
  contentContainer: {
    borderRadius: 35,
    backgroundColor: '#7B6DCD',
    overflow: 'hidden'
  }
});
