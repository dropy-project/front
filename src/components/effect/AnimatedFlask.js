import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import Styles, { Colors } from '../../styles/Styles';
import useCurrentUser from '../../hooks/useCurrentUser';

const MAX_ENERGY = 90;
const FLASK_BORDER_RADIUS = 20;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const AnimatedFlask = ({ color = Colors.purple2, size = 60 }) => {
  const pathAnimatedValue = useRef(new Animated.Value(0)).current;
  const path2AnimatedValue = useRef(new Animated.Value(0)).current;
  const flaskFillAnimatedValue = useRef(new Animated.Value(0)).current;

  const { user } = useCurrentUser();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused)
      return animateFill();
  }, [isFocused, user.lastEnergyIncrement]);

  useEffect(() => {
    if (user == null)
      return;
    const energyClamped = Math.min(Math.max((user.energy / MAX_ENERGY), 0), 1);
    flaskFillAnimatedValue.setValue(energyClamped);
  }, []);

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

  const animateFill = () => {
    if (user.lastEnergyIncrement == null)
      return;
    const energyClamped = Math.min(Math.max((user.energy * 100 / MAX_ENERGY), 0), 100);

    const anim = Animated.sequence([
      Animated.delay(500),
      Animated.timing(flaskFillAnimatedValue, {
        toValue: energyClamped / 100,
        duration: 2000,
        useNativeDriver: true,
      })
    ]);
    anim.start();
  };

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
    <View style={{ marginBottom: 10 }}>
      <View style={{
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        ...Styles.center,
      }}>
        <View
          style={{
            ...styles.flaskContainer,
            height: size * 1.8,
            width: size * 0.25,
          }}>
          <Animated.View
            style={{
              ...styles.flaskFill,
              backgroundColor: color,
              height: '110%',
              transform: [{ translateY: pathFlaskTranslate }],
            }}
          />
          <AnimatedSvg
            width='240'
            height='40'
            viewBox='0 0 824 39'
            style={{
              position: 'absolute',
              bottom: 102,
              transform: [{ translateX: pathTranslate }, { translateY: pathFlaskTranslate }],
              opacity: 0.7,
            }}>
            <Path
              fill={color}
              d='M 21 28 C 21 28 -18.914803 46.585373 21 26 C 60.914803 5.414623 76.159401 8.829062 113 23 C 145.672577 35.567688 178.94249 -14.561428 241 18 C 277.601013 37.204456 320.646027 4.706551 365 17 C 433.746216 36.054169 484.215912 -0.820065 539 13 C 581.190247 23.643089 609.878418 -14.94294 679 13 C 738.92572 37.225441 786.059143 -10.737301 821 13 L 821 28 L 21 28 Z'
            />
          </AnimatedSvg>
          <AnimatedSvg
            width='240'
            height='40'
            viewBox='0 0 824 39'
            style={{
              position: 'absolute',
              bottom: 101,
              transform: [{ translateX: path2Translate }, { translateY: pathFlaskTranslate }],
            }}>
            <Path
              fill={color}
              d='M 21 28 C 21 28 -18.914803 46.585373 21 26 C 60.914803 5.414623 76.159401 8.829062 113 23 C 145.672577 35.567688 178.94249 -14.561428 241 18 C 277.601013 37.204456 320.646027 4.706551 365 17 C 433.746216 36.054169 484.215912 -0.820065 539 13 C 581.190247 23.643089 609.878418 -14.94294 679 13 C 738.92572 37.225441 786.059143 -10.737301 821 13 L 821 28 L 21 28 Z'
            />
          </AnimatedSvg>
          <View style={styles.lightBounceOverlay} />
          <View
            style={{
              ...styles.flaskOutline,
              borderWidth: size * 0.06,
            }}
          />
        </View>
        <View style={{ backgroundColor: 'white', borderRadius: 50, height: 20, width: 20, position: 'absolute', top: -15, ...Styles.center }}>
          <MaterialCommunityIcons name='lightning-bolt' size={size * 0.25} color={Colors.purple2} />
        </View>
      </View>
    </View>
  );
};

export default AnimatedFlask;

const styles = StyleSheet.create({
  flaskContainer: {
    borderBottomLeftRadius: FLASK_BORDER_RADIUS,
    borderBottomRightRadius: FLASK_BORDER_RADIUS,
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
    borderBottomLeftRadius: FLASK_BORDER_RADIUS,
    borderBottomRightRadius: FLASK_BORDER_RADIUS,
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
