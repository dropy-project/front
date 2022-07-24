import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import DropyLogo from '../../assets/svgs/dropy_logo.svg';

const MapLoadingOverlay = ({ visible = true }) => {

  const [render, setRender] = useState(visible);

  const opacityAnimatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(opacityAnimatedValue, {
      toValue: visible ? 1 : 0,
      duration: visible ? 0 : 300,
      useNativeDriver: true,
    });
    anim.start(( { finished } ) => {
      if(finished) {
        setRender(visible);
      }
    });
    return anim.stop;
  }, [visible]);

  if(!render) return null;

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        ...Styles.center,
        backgroundColor: Colors.white,
        opacity: opacityAnimatedValue,
      }}>
      <AnimatedLogo />
      <Text style={{ ...Fonts.bold(12, Colors.purple2) }}>Seeking for your location...</Text>
    </Animated.View>
  );
};

export default MapLoadingOverlay;

const AnimatedLogo = () => {

  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ]));
    anim.start();
    return anim.stop;
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale : animatedValue }] }}>
      <DropyLogo width={responsiveWidth(10)} />
    </Animated.View>
  );
};
