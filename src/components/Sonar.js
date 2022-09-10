import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import Svg, { Circle, RadialGradient, Stop } from 'react-native-svg';
import Styles, { Colors, Map } from '../styles/Styles';
import GlassCircleButton from './GlassCircleButton';

const CENTER_ICON_SIZE = 15;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Sonar = ({ visible, zoomValue }) => {

  const visibleAnimatedValue = useRef(new Animated.Value(0)).current;
  const sonarWaveAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(sonarWaveAnimatedValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(sonarWaveAnimatedValue, {
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

  useEffect(() => {
    const anim = Animated.timing(visibleAnimatedValue, {
      toValue: visible ? 1 : 0,
      duration: visible ? 500 : 200,
      delay: visible ? 1400 : 200,
      useNativeDriver: true,
      easing: visible ? Easing.elastic(1.1) : undefined,
    });
    anim.start();
    return anim.stop;
  }, [visible]);

  const sonarWaveScale = sonarWaveAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3.5],
  });

  const sonarWaveOpacity = sonarWaveAnimatedValue.interpolate({
    inputRange: [0.7, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      pointerEvents='none'
      style={{
        ...Styles.center,
        ...StyleSheet.absoluteFillObject,
        transform: [
          { translateY: CENTER_ICON_SIZE / 2 },
          { scale: Animated.multiply(
            Math.max(0.3, -(1 - (zoomValue / Map.MIN_ZOOM)) * 10),
            visibleAnimatedValue
          ) }
        ],
      }}>
      <AnimatedSvg
        pointerEvents="none"
        style={{
          ...styles.container,
          transform: [{ scale: sonarWaveScale }],
          opacity: sonarWaveOpacity,
        }}
        height="100"
        width="100"
      >
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
        <Circle
          cx="50" cy="50" r="50" fill="url(#grad)"
        />
      </AnimatedSvg>
      <GlassCircleButton disabled size={CENTER_ICON_SIZE} />
    </Animated.View>
  );
};

export default Sonar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
