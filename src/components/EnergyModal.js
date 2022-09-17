import { Animated, Easing, StyleSheet, Text } from 'react-native';
import React, { useRef , useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';

const EnergyModal = ({ energy = 30, visible = true }) => {

  const visibleAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(visibleAnimatedValue, {
      toValue: visible ? 1 : 0,
      duration: visible ? 500 : 200,
      delay: visible ? 1000 : 300,
      useNativeDriver: true,
      easing: visible ? Easing.elastic(1.1) : undefined,
    });
    anim.start();
    return anim.stop;
  }, [visible]);


  return (
    <Animated.View style={{ ...styles.conainter, transform: [{ scale: visibleAnimatedValue }] }}>
      <Text style={styles.energy}>+{energy}</Text>
      <MaterialCommunityIcons name="lightning-bolt" size={24} color="white" />
    </Animated.View>
  );
};

export default EnergyModal;

const styles = StyleSheet.create({
  conainter: {
    ...Styles.center,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.purple2,
    width: 100,
    height: 45,
    borderRadius: 20,
    bottom: 150,
    ...Styles.softShadows,
  },
  energy: {
    ...Fonts.bold(16, 'white'),
  },

});
