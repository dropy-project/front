import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Fonts } from '../styles/Styles';

export const DotIndicator = ({ currentIndex, isSkippable = true }) => {
  const dots = [];
  for (let i = 0; i < 7; i++) {
    dots.push(
      <View key={i} style={{ ...styles.dot, backgroundColor: currentIndex === i ? Colors.grey : Colors.lightGrey }} />
    );
  }
  return (
    <View style={styles.indicatorContainer}>
      {dots}
      {isSkippable && (
        <TouchableOpacity>
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center' ,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  skipText: {
    ...Fonts.bold(13, Colors.darkGrey),
    position: 'absolute',
    bottom: -10,
    right: -60,
  },
});
