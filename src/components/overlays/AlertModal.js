import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import GlassButton from '../GlassButton';

const AlertModal = ({ visible, data }) => {

  const [lastData, setLastData] = useState(data);

  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if(visible)
      setLastData(data);
  }, [data]);

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.elastic(1.1),
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
        <Text style={styles.title}>{lastData?.title}</Text>

        <TouchableOpacity onPress={lastData?.onPressDeny} style={styles.cross}>
          <Ionicons name="ios-close" size={24} color={Colors.lightGrey} />
        </TouchableOpacity>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{lastData?.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          {lastData?.denyText != null && (
            <TouchableOpacity style={styles.denyButton} onPress={lastData?.onPressDeny}>
              <Text style={{ ...Fonts.bold(14, Colors.darkGrey), letterSpacing: 1, textAlign: 'center' }}>{lastData?.denyText}</Text>
            </TouchableOpacity>
          )}
          <GlassButton
            onPress={lastData?.onPressValidate}
            buttonText={lastData?.validateText}
            style={styles.validateButton}
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
    backgroundColor: Colors.white,
    borderRadius: 25,
    width: responsiveWidth(80),
    ...Styles.hardShadows,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
  },
  cross: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  title: {
    ...Fonts.bold(16, Colors.purple1),
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  descriptionContainer: {
    width: '90%',
    minHeight: 100,
    ...Styles.center,
  },
  description: {
    ...Fonts.bold(13, Colors.grey),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  denyButton: {
    height: 50,
    width: '50%',
    borderRadius: 25,
    ...Styles.center,
    paddingHorizontal: 20,
    ...Styles.center,
  },
  validateButton: {
    minHeight: 50,
    flex: 1,
    borderRadius: 20,
    ...Styles.hardShadows,
    ...Styles.center,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
});

export default AlertModal;
