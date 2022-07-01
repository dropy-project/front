import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import GlassButton from '../GlassButton';

const AlertModal = ({ visible, title, description, denyText, validateText, onPressValidate, onPressDeny }) => {

  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    });
    anim.start(({ finished }) => {
      if (finished) {
        setRender(visible);
      }
    });
    return anim.stop;
  }, [visible]);

  const scaleValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  if(!render) return null;

  return (
    <Animated.View style={{ ...styles.backgroundContainer, opacity: animatedValue }}>
      <Animated.View style={{ ...styles.container, transform: [{ scale: scaleValue }] }}>
        <Text style={styles.title}>{title}</Text>
        <Entypo name="cross" size={24} style={styles.cross} onPress={onPressDeny} />
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.denyButton} onPress={onPressDeny}>
            <Text style={{ ...Fonts.bold(14, Colors.darkGrey), letterSpacing: 4 }}>{denyText}</Text>
          </TouchableOpacity>
          <GlassButton
            onPress={onPressValidate}
            buttonText={validateText}
            style={styles.turnonButton}
            fontSize={14}
          >
          </GlassButton>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...Styles.center,
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    position: 'absolute',
    height: 300,
    backgroundColor: Colors.white,
    borderRadius: 25,
    width:300,
    ...Styles.hardShadows,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cross: {
    color: Colors.lightGrey,
    position: 'absolute',
    top: '5%',
    right: '3%',
  },
  title: {
    ...Fonts.bold(14, Colors.purple1),
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  description: {
    ...Fonts.bold(12, Colors.grey),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  denyButton: {
    height: 50,
    borderRadius: 25,
    ...Styles.center,
    paddingHorizontal: 10,
  },
  turnonButton: {
    height: 50,
    borderRadius: 25,
    ...Styles.hardShadows,
    ...Styles.center,
    paddingHorizontal: 10,
  },
});

export default AlertModal;
