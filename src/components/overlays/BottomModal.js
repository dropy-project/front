import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Entypo , AntDesign } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';


const BottomModal = ({ visible, title, description, onPressClose }) => {

  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
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
    <Animated.View style={{ ...styles.container, transform: [{ translateY: translateValue }] }}>
      <TouchableOpacity style={styles.cross} onPress={onPressClose}>
        <Entypo name="cross" size={24} color='white' />
      </TouchableOpacity>
      <AntDesign style={styles.warning}name="warning" size={70} color="white" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    position: 'absolute',
    bottom: -100,
    backgroundColor: Colors.purple2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: '100%',
    ...Styles.hardShadows,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 100,
  },
  cross: {
    color: Colors.white,
    position: 'absolute',
    top: '5%',
    right: '3%',
  },
  warning: {
    color: Colors.white,
  },
  title: {
    ...Fonts.bold(16, Colors.white),
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  description: {
    ...Fonts.regular(13, Colors.lighterGrey),
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default BottomModal;
