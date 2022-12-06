import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../../styles/Styles';

const DoubleConnectionOverlay = () => (
  <View style={styles.container}>
    <Text style={styles.mainText}>{'Ce compte est deja en cours d\'utilisation sur un autre appareil'}</Text>
  </View>
);

export default DoubleConnectionOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    ...Styles.center,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mainText: {
    ...Fonts.bold(14, Colors.white),
    textAlign: 'center',
    width: '80%',
  },
});
