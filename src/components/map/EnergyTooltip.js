import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import useCurrentUser from '../../hooks/useCurrentUser';
import Haptics from '../../utils/haptics';
import Storage from '../../utils/storage';

const EnergyTooltip = ({ style, children }) => {
  const { user } = useCurrentUser();
  const tooltipAnimatedValue = useRef(new Animated.Value(0)).current;

  const [isPressed, _setIsPressed] = useState(false);
  const [render, setRender] = useState(false);

  useEffect(() => {
    handleInitialDisplay();
  }, []);

  const handleInitialDisplay = async () => {
    const requireInitialDisplay = await Storage.getItem('@energy_tooltip_initial_display') == null;
    if (!requireInitialDisplay)
      return;

    Storage.setItem('@energy_tooltip_initial_display', true);

    _setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      setRender(false);
    }, 5000);
  };

  useEffect(() => {
    const anim = Animated.timing(tooltipAnimatedValue, {
      toValue: isPressed ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(.89, .17, .57, 1.23),
      useNativeDriver: true,
    });
    anim.start();
    return anim.stop;
  }, [isPressed]);

  const setIsPressed = (value) => {
    Haptics.impactLight();
    _setIsPressed(value);
    setRender(value);
  };

  const scaleAnimatedValue = tooltipAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const translateAnimatedValue = tooltipAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={{ ...Styles.center, ...style }}>
      { render && <Animated.View style={{
        ...styles.tooltipContainer,
        opacity: tooltipAnimatedValue,
        transform: [{ scale: scaleAnimatedValue }, { translateX: translateAnimatedValue }],
      }}>
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={() => setIsPressed(false)}
        >
          <View style={styles.titleView}>
            <MaterialCommunityIcons name='lightning-bolt' size={20} color={Colors.white} />
            <Text style={styles.energyValue}>{user.energy} / 90</Text>
          </View>
          <View>
            <Text style={styles.description}>Ton energie diminue en ramassant un drop, tu peux la remplir en posant des drops</Text>
          </View>
        </TouchableOpacity>
      </Animated.View> }
      <TouchableOpacity
        activeOpacity={0.8}
        delayPressOut={isPressed ? 2000 : 0}
        style={{ ...Styles.center, ...style }}
        onPressIn={() => setIsPressed(!isPressed)}
        onPressOut={() => setIsPressed(false)}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

export default EnergyTooltip;

const styles = StyleSheet.create({
  tooltipContainer: {
    ...Styles.center,
    position: 'absolute',
    bottom: 15,
    left: -210,
    right: 0,
    height: 110,
    width: 210,
    borderRadius: 10,
    backgroundColor: Colors.purple2,
    ...Styles.hardShadows,
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginTop: 7,
    marginLeft: 5,
  },
  energyValue: {
    ...Fonts.bold(12, Colors.white),
    marginLeft: 5,
  },
  description: {
    ...Fonts.bold(11, Colors.white),
    margin: 8,
  },
});
