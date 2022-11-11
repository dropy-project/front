import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';


const TouchableTooltip = ({ style, children, tooltipText }) => {
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
        <Text style={{ ...Fonts.regular(13, Colors.white) }}>{tooltipText}</Text>
      </Animated.View>
      <TouchableOpacity
        delayPressOut={500}
        style={{ ...Styles.center, ...style }}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default TouchableTooltip;

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    top: '-150%',
    padding: 10,
    backgroundColor: Colors.darkGrey,
    borderRadius: 10,
    minWidth: 140,
    ...Styles.center,
  },
});
