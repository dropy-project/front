import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const FadeInWrapper = ({ children, duration = 300, delay = 0, visible = true }) => {
  const fadeInAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(fadeInAnimatedValue, {
      toValue: visible ? 1 : 0,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    });
    anim.start();
    return anim.stop;
  }, [visible]);

  const scaleAnimatedValue = fadeInAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Animated.View style={{ opacity: fadeInAnimatedValue, transform: [{ scale: scaleAnimatedValue }] }}>
      {children}
    </Animated.View>
  );
};

export default FadeInWrapper;
