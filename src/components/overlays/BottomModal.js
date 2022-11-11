import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';


const BottomModal = ({ visible, data }) => {
  const [lastData, setLastData] = useState(data);

  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible)
      setLastData(data);
  }, [data]);

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    });
    anim.start(({ finished }) => {
      if (finished)
        setRender(visible);
    });
    return anim.stop;
  }, [visible]);

  const translateValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['300%', '0%'],
  });

  if (!render)
    return null;

  return (
    <Animated.View style={{ ...styles.container, transform: [{ translateY: translateValue }] }}>

      <TouchableOpacity onPress={lastData?.onPressClose} style={styles.cross}>
        <Ionicons name='ios-close' size={24} color={Colors.white} />
      </TouchableOpacity>

      <AntDesign style={styles.warning}name='warning' size={50} color='white' />
      <Text style={styles.title}>{lastData?.title}</Text>
      <Text style={styles.description}>{lastData?.description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,

    height: '25%',
    width: '100%',

    backgroundColor: Colors.purple2,
    ...Styles.hardShadows,

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: '10%',
  },
  cross: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    ...Fonts.bold(13, Colors.lighterGrey),
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});

export default BottomModal;
