import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Styles, { Colors } from '../styles/Styles';

const LoadingSpinner = ({ size = 40, color = Colors.grey, selfCenter = false }) => {

  const spinAnimationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnimationValue,{
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return spin.stop;
  }, []);

  const spin = spinAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={selfCenter && { flex: 1, ...Styles.center }}>
      <Animated.View style={{ transform: [{ rotate: spin }], ...Styles.center }}>
        <AntDesign name="loading2" size={size} color={color} />
      </Animated.View>
    </View>
  );
};

export default LoadingSpinner;
