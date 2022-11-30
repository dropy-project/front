import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import useCurrentUser from '../../hooks/useCurrentUser';

const MAX_ENERGY = 90;

const EnergyTooltip = ({ style, children }) => {
  const { user } = useCurrentUser();
  const tooltipAnimatedValue = useRef(new Animated.Value(0)).current;

  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const anim = Animated.timing(tooltipAnimatedValue, {
      toValue: isPressed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    });
    anim.start();
    return anim.stop;
  }, [isPressed]);

  return (
    <View style={{ ...Styles.center, ...style }}>
      <Animated.View style={{ ...styles.tooltipContainer, opacity: tooltipAnimatedValue }}>
        <View style={styles.titleView}>
          <MaterialCommunityIcons name='lightning-bolt' size={16} color={Colors.white} />
          <Text style={styles.energyValue}>{Math.floor((user.energy * 100) / MAX_ENERGY)} / 100</Text>
        </View>
        <View>
          <Text style={styles.description}>Ton energie diminue en ramassant un drop, tu peux la remplir en posant des drops</Text>
        </View>
      </Animated.View>
      <TouchableOpacity
        delayPressOut={2000}
        style={{ ...Styles.center, ...style }}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        {children}
      </TouchableOpacity>
    </View>

  );
};

export default EnergyTooltip;

const styles = StyleSheet.create({
  tooltipContainer: {
    ...Styles.center,
    position: 'absolute',
    bottom: 20,
    left: -200,
    right: 0,
    height: 90,
    width: 200,
    borderRadius: 10,
    backgroundColor: Colors.purple2,
    ...Styles.softShadows,
    shadowOpacity: 0.2,
  },
  titleView: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    width: '90%',
    marginTop: 5,
  },
  energyValue: {
    ...Fonts.bold(11, Colors.white),
  },
  description: {
    ...Fonts.bold(9, Colors.white),
    margin: 10,
  },
});
