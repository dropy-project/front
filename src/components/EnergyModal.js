import { Animated, Easing, StyleSheet, Text } from 'react-native';
import React, { useRef , useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';
import useCurrentUser from '../hooks/useCurrentUser';

const EnergyModal = ({ navigation }) => {

  const visibleAnimatedValue = useRef(new Animated.Value(0)).current;

  const { user, setUser } = useCurrentUser();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user.lastEnergyIncrement == null) return;

      const anim = Animated.sequence([
        Animated.timing(visibleAnimatedValue, {
          toValue: 1,
          duration: 500,
          delay: 1000,
          useNativeDriver: true,
          easing:Easing.elastic(1.1),
        }),
        Animated.delay(4000),
        Animated.timing(visibleAnimatedValue, {
          toValue:  0,
          duration: 200,
          delay: 300,
          useNativeDriver: true,
          easing: undefined,
        })
      ]);
      anim.start(({ finished }) => {
        console.log('LAAAAAAAAAAAAAAAAA');
        if (finished) {
          setUser({ ...user, lastEnergyIncrement: null });
          console.log('ICIIIIIIIIIIIIIIIII');
        }
      });
      return anim.stop;
    });
    return unsubscribe;
  }, []);

  console.log('lastEnergyIncrement', user.lastEnergyIncrement);


  return (
    <Animated.View style={{ ...styles.conainter, transform: [{ scale: visibleAnimatedValue }] }}>
      <Text style={styles.lastEnergyIncrement}>{user?.lastEnergyIncrement > 0 ? `+ ${user?.lastEnergyIncrement}` : user?.lastEnergyIncrement}</Text>
      <MaterialCommunityIcons name="lightning-bolt" size={24} color="white" />
    </Animated.View>
  );
};

export default EnergyModal;

const styles = StyleSheet.create({
  conainter: {
    ...Styles.center,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.purple2,
    width: 100,
    height: 45,
    borderRadius: 20,
    bottom: 150,
    ...Styles.softShadows,
  },
  lastEnergyIncrement: {
    ...Fonts.bold(16, 'white'),
  },

});
