import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors } from '../styles/Styles';


const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const AnimatedFlask = ({ color = Colors.purple2, energy = 80, size = 60,  visible = true }) => {
  const pathAnimatedValue = useRef(new Animated.Value(0)).current;
  const path2AnimatedValue = useRef(new Animated.Value(0)).current;
  const flaskFillAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    pathAnimatedValue.setValue(Math.random());
    path2AnimatedValue.setValue(Math.random());
    const offset = Math.random() * 500;
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pathAnimatedValue, {
            toValue: 1,
            duration: 7000 + offset,
            useNativeDriver: true,
          }),
          Animated.timing(pathAnimatedValue, {
            toValue: 0,
            duration: 7000 + offset,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(path2AnimatedValue, {
            toValue: 1,
            duration: 8000 + offset,
            useNativeDriver: true,
          }),
          Animated.timing(path2AnimatedValue, {
            toValue: 0,
            duration: 6500 + offset,
            useNativeDriver: true,
          })
        ])
      ])
    );
    loop.start();
    return loop.stop;
  }, []);

  useEffect(() => {
    const anim = Animated.timing(flaskFillAnimatedValue, {
      toValue: energy / 100,
      duration: 2000,
      useNativeDriver: true,
    });
    anim.start();
    return anim.stop;
  }, [energy]);

  const pathFlaskTranslate = flaskFillAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [115, 0],
  });

  const pathTranslate = pathAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 80],
  });

  const path2Translate = path2AnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [80, -80],
  });

  return (
    <>
      { visible && (
        <View style={{
          position: 'absolute',
          right: 10,
          bottom: 250,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          ...Styles.center }}>
          <View
            style={{
              ...styles.flaskContainer,
              height: size * 1.8,
              width: size * 0.25,
              borderRadiusBottom: size,
              borderWidth: 2,
              borderColor: 'white',
            }}>
            <Animated.View
              style={{
                ...styles.flaskFill,
                backgroundColor: Colors.purple3,
                height: '110%',
                transform: [{ translateY: pathFlaskTranslate }],
              }}
            />
            <AnimatedSvg
              width="240"
              height="40"
              viewBox="0 0 824 39"
              style={{
                position: 'absolute',
                bottom:93,
                transform: [{ translateX: pathTranslate }, { translateY: pathFlaskTranslate }],
                opacity: 0.7,
              }}>
              <Path
                fill={color}
                d="M 21 28 C 21 28 -18.914803 46.585373 21 26 C 60.914803 5.414623 76.159401 8.829062 113 23 C 145.672577 35.567688 178.94249 -14.561428 241 18 C 277.601013 37.204456 320.646027 4.706551 365 17 C 433.746216 36.054169 484.215912 -0.820065 539 13 C 581.190247 23.643089 609.878418 -14.94294 679 13 C 738.92572 37.225441 786.059143 -10.737301 821 13 L 821 28 L 21 28 Z"
              />
            </AnimatedSvg>
            <AnimatedSvg
              width="240"
              height="40"
              viewBox="0 0 824 39"
              style={{
                position: 'absolute',
                bottom:94,
                transform: [{ translateX: path2Translate },{ translateY: pathFlaskTranslate }],
              }}>
              <Path
                fill={color}
                d="M 21 28 C 21 28 -18.914803 46.585373 21 26 C 60.914803 5.414623 76.159401 8.829062 113 23 C 145.672577 35.567688 178.94249 -14.561428 241 18 C 277.601013 37.204456 320.646027 4.706551 365 17 C 433.746216 36.054169 484.215912 -0.820065 539 13 C 581.190247 23.643089 609.878418 -14.94294 679 13 C 738.92572 37.225441 786.059143 -10.737301 821 13 L 821 28 L 21 28 Z"
              />
            </AnimatedSvg>
            <View style={styles.lightBounceOverlay} />
            <View
              style={{
                ...styles.flaskOutline,
                borderWidth: size * 0.03,
                borderBottomLeftRadius: size,
                borderBottomRightRadius: size,
              }}
            />
          </View>
          <View style={{ backgroundColor: 'white', borderRadius: 50, height: 20, width: 20, position: 'absolute', top: -15, ...Styles.center }}>
            <MaterialCommunityIcons name="lightning-bolt" size={size * 0.25} color={Colors.purple2} />
          </View>
        </View>
      )}
    </>
  );
};

export default AnimatedFlask;

const styles = StyleSheet.create({
  flaskContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    ...Styles.center,
  },
  flaskOutline: {
    position: 'absolute',
    top: -1,
    left: -1,
    bottom: -1,
    right: -1,
    borderColor: 'white',
  },
  flaskFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  lightBounceOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: '60%',
  },
});
