import React, { useEffect, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet, Text } from 'react-native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import DropyLogo from '../../assets/svgs/dropy_logo.svg';
import GlassButton from '../input/GlassButton';

const MapLoadingOverlay = ({ visible = true, isGeolocationPermissionGranted = false }) => {
  const [render, setRender] = useState(visible);

  const opacityAnimatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(opacityAnimatedValue, {
      toValue: visible ? 1 : 0,
      delay: visible ? 0 : 500,
      duration: visible ? 0 : 500,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (finished)
        setRender(visible);
    });
    return anim.stop;
  }, [visible]);

  if (!render)
    return null;

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        ...Styles.center,
        backgroundColor: Colors.white,
        opacity: opacityAnimatedValue,
      }}>
      <AnimatedLogo />
      <Text style={{ ...Fonts.bold(12, Colors.purple2) }}>{isGeolocationPermissionGranted ? 'Recherche de votre position...' : 'La géolocalisation n\'est pas autorisée'}</Text>

      {!isGeolocationPermissionGranted && (
        <GlassButton onPress={() => Linking.openSettings()} buttonText={'Ouvrir les paramètres'} disabled={false} style={styles.openSettingsButton} fontSize={12} />
      )}
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
    <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
      <DropyLogo width={responsiveWidth(10)} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  openSettingsButton: {
    height: 50,
    width: '55%',
    position: 'absolute',
    bottom: '25%',
    borderRadius: 23,
    ...Styles.hardShadows,
    ...Styles.center,
    paddingHorizontal: 20,
  },
});
