import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Colors, Fonts } from '../styles/Styles';

const Notification = ({ data, onDone }) => {

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.elastic(1.1),
      }),
      Animated.delay(2000),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]);
    anim.start(onDone);
    return anim.stop;
  }, [data]);

  const translateValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-150%', '0%'],
  });

  const handlePress = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });
    data?.onPress();
  };

  if(data == null)
    return null;

  return (
    <Animated.View style={{ ...styles.container, transform: [{ translateY: translateValue }] }}>
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableOpacity onPress={handlePress} style={styles.notification}>
          <Text style={{ ...Fonts.bold(15, Colors.white) }}>{data?.title}</Text>
          <Text style={{ ...Fonts.regular(13, Colors.white) }}>{data?.body}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'absolute',
    width: '80%',
    alignItems: 'center',
  },
  safeAreaView: {
    width: '100%',
    alignItems: 'center',
  },
  notification: {
    backgroundColor: Colors.purple2,
    width: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});
