import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Colors, Fonts } from '../styles/Styles';

import DropyLogo from '../assets/svgs/dropy_logo.svg';
import ParticleEmitter from '../components/effect/ParticleEmitter';
import FooterConfirmation from '../components/other/FooterConfirmation';
import GoBackHeader from '../components/other/GoBackHeader';

const GetDropyScreen = ({ navigation, route }) => {
  const { dropy = null } = route.params || {};

  const circleAnimation = useRef(new Animated.Value(0)).current;
  const circleBreathing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.timing(circleAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
      Animated.delay(1500)
    ]);
    anim.start();
    return anim.stop;
  }, []);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(circleBreathing, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(circleBreathing, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ])
    );
    anim.start();
    return anim.stop;
  }, []);

  const bigCircle = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const largeCircle = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const breathing = circleBreathing.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });

  const handleConfirmation = (dropy) => {
    navigation.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'DisplayDropyMedia', params: { dropy, showBottoModal: true } }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      <ParticleEmitter particlesColor={Colors.lighterGrey} />
      <View style={styles.containerImage}>
        <Text style={styles.topText}>{'You\'ve just found'}</Text>
        <DropyLogo height={87} width={87} />
        <Text style={styles.bottomText}>A new Drop</Text>
        <Animated.View style={{ ...styles.largeCircle, transform: [{ scale: Animated.multiply(breathing, circleAnimation) }] }} />
        <Animated.View style={{ ...styles.largerCircle, transform: [{ scale: Animated.multiply(breathing, bigCircle) }] }} />
        <Animated.View style={{ ...styles.bigCircle, transform: [{ scale: Animated.multiply(breathing, largeCircle) }] }} />
      </View>
      <FooterConfirmation dropy={dropy} onPress={() => handleConfirmation(dropy)} textButton='Open !'/>
    </SafeAreaView>
  );
};

export default GetDropyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  containerImage: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    ...Fonts.regular(18, Colors.darkGrey),
    marginBottom: 30,
  },
  bottomText: {
    ...Fonts.bold(18, '#7B6DCD'),
    marginTop: 30,
  },
  largeCircle: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#94B2DE',
    borderStyle: 'solid',
  },
  largerCircle: {
    position: 'absolute',
    width: 613,
    height: 613,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#dac9f2',
    borderStyle: 'solid',
  },
  bigCircle: {
    position: 'absolute',
    width: 647,
    height: 647,
    borderRadius: 500,
    borderWidth: 9,
    borderColor: '#b48eff',
    borderStyle: 'solid',
  },
});
