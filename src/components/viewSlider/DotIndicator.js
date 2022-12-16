import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../styles/Styles';

export const DotIndicator = ({ currentIndex, isSkippable = false, onPressSkip }) => (
  <View style={styles.indicatorContainer}>
    {[...new Array(6)].map((_, i) => (
      <View key={i} style={{ ...styles.dot, backgroundColor: currentIndex - 1 === i ? Colors.grey : Colors.lightGrey }} />
    ))}
    {isSkippable && (
      <TouchableOpacity style={styles.skipBtn} onPress={onPressSkip}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  skipBtn: {
    position: 'absolute',
    right: 35,
  },
  skipText: {
    ...Fonts.bold(13, Colors.darkGrey),
  },
});
