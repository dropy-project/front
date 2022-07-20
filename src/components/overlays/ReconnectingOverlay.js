import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import LoadingSpinner from '../LoadingSpinner';

const ReconnectingOverlay = ({ visible }) => {

  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      delay: visible ? 300 : 0,
      useNativeDriver: true,
      easing: Easing.ease,
    });
    anim.start(({ finished }) => {
      if (finished) {
        setRender(visible);
      }
    });
    return anim.stop;
  }, [visible]);

  const translateValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['300%', '0%'],
  });

  if(!render) return null;

  return (
    <Animated.View style={{ ...styles.container, opacity: animatedValue }}>
      <Animated.View style={{ ...styles.animatedContainer, transform: [{ translateY: translateValue }] }}>
        <SafeAreaView style={styles.alertContainer}>
          <View style={Styles.center}>
            <Text style={{ ...Fonts.bold(15, Colors.purple1) }}>{'Oups, we lost you...'}</Text>
            <Text style={{ ...Fonts.regular(13, Colors.purple1), marginTop: 7 }}>{'Stay still, we\'re reconnecting!'}</Text>
          </View>
          <LoadingSpinner color={Colors.purple1} />
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
};

export default ReconnectingOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  alertContainer: {
    width: '100%',
    minHeight: responsiveHeight(25),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
