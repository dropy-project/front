import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Animated,
  Easing
} from 'react-native';
import GoBackHeader from '../components/GoBackHeader';
import DropyLogo from '../assets/svgs/dropy_logo.svg';
import { Colors, Fonts } from '../styles/Styles';
import FooterConfirmation from '../components/FooterConfirmation';

const GetDropyScreen = ({ navigation, route }) => {

  const { dropy = null } = route.params || {};

  const circleAnimation = useRef(new Animated.Value(0)).current;
  const circleBreathing = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim =
      Animated.sequence([
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

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      <View style={styles.containerImage}>
        <Text style={styles.topText}>{'You\'ve juste found'}</Text>
        <DropyLogo height={87} width={87} />
        <Text style={styles.bottomText}>A new Drop</Text>
        <Animated.View style={{ ...styles.largeCircle, transform: [{ scale: Animated.multiply(breathing, circleAnimation) }] }} />
        <Animated.View style={{ ...styles.largerCircle, transform: [{ scale: Animated.multiply(breathing, bigCircle) }] }} />
        <Animated.View style={{ ...styles.bigCircle, transform: [{ scale: Animated.multiply(breathing, largeCircle) }] }} />
      </View>
      <View style={styles.mediumDot}></View>
      <View style={styles.littlerDot} />
      <View style={styles.littleDot} />
      <View style={styles.dot} />
      <FooterConfirmation dropy={dropy} onPress={() => navigation.navigate('DisplayDropyMedia', { dropy })} />
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
  mediumDot: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 14,
    height: 14,
    left: 25,
    top: 298,
    borderRadius: 7,
  },
  littlerDot: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 8,
    height: 8,
    left: 321,
    top: 361,
    borderRadius: 10,
  },
  littleDot: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 10,
    height: 10,
    left: 176,
    top: 146,
    borderRadius: 10,
  },
  dot: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 14,
    height: 14,
    left: 293,
    top: 527,
    borderRadius: 7,
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
