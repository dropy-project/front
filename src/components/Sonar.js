import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import Svg, { Circle, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../styles/Styles';
import GlassCircleButton from './GlassCircleButton';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Sonar = () => {

  const sonarAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(sonarAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(sonarAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1500)
      ])
    );
    anim.start();
    return anim.stop;
  }, []);

  const sonarScale = sonarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const sonarOpacity = sonarAnimation.interpolate({
    inputRange: [0.7, 1],
    outputRange: [1, 0],
  });

  return (
    <>
      <AnimatedSvg pointerEvents="none" style={{ ...styles.container, transform: [{ scale: sonarScale }], opacity: sonarOpacity }} height="100" width="100">
        <RadialGradient
          id="grad"
          cx="50%"
          cy="50%"
          rx="50%"
          ry="50%"
          fx="50%"
          fy="50%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="50%" stopColor="rgba(255,255,255,0)" stopOpacity="0" />
          <Stop offset="100%" stopColor={Colors.mainBlue} stopOpacity="0.4" />
        </RadialGradient>
        <Circle cx="50" cy="50" r="50" fill="url(#grad)" />
      </AnimatedSvg>
      <GlassCircleButton disabled size={15} />
    </>
  );
};

export default Sonar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
