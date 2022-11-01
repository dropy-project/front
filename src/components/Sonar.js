import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import Svg, { Circle, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import Styles, { Colors, Map } from '../styles/Styles';
import GlassCircleButton from './GlassCircleButton';

export const CENTER_ICON_SIZE = 15;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const Sonar = ({ visible, heading, zoom, compassHeading }) => {

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

  const zoomScale = Math.max(
    0.3,
    (((zoom || 1) - Map.MIN_ZOOM) / (Map.MAX_ZOOM - Map.MIN_ZOOM))
  );

  return (
    <Animated.View
      pointerEvents='none'
      style={{
        ...Styles.center,
        ...StyleSheet.absoluteFillObject,
        transform: [
          { translateY: CENTER_ICON_SIZE / 2 },
          { scale: Animated.multiply(
            zoomScale,
            visibleAnimatedValue
          ) }
        ],
      }}>
      <View
        pointerEvents='none'
        style={{
          ...styles.directionPointerContainer,
          transform: [
            { rotate: `${(-heading || 0) + compassHeading}deg` },
            { translateY: -10 }
          ],
        }}>
        <View
          pointerEvents='none'
          style={styles.directionPointer}>
          <Svg viewBox='0 0 177 148' width={33} height={33}>
            <Path fill="url(#grad)" d='M1.65191 30.2667C-0.840453 25.5698 1.25381 19.7886 6.25162 17.9734C22.72 11.9919 58.0604 0.5 86.5 0.5C114.94 0.5 150.28 11.9919 166.748 17.9734C171.746 19.7886 173.84 25.5698 171.348 30.2667L108.875 148H86.5H64.125L1.65191 30.2667Z' />
            <LinearGradient id="grad" x1="0%" y1="10%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="rgb(100,25,255, 0.1)" stopOpacity="0" />
              <Stop offset="100%" stopColor={Colors.mainBlue} stopOpacity="0.3" />
            </LinearGradient>
          </Svg>
        </View>
      </View>
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
          id="grad" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%"
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
  directionPointerContainer: {
    ...Styles.center,
    width: 30,
    height: 30,
    position: 'absolute',
  },
  directionPointer: {
    position: 'absolute',
    ...Styles.center,
    top: -5,
  },
});
