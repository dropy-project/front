import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import useCurrentUser from '../../hooks/useCurrentUser';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import LoadingSpinner from '../effect/LoadingSpinner';
import DebugUrlsMenu from '../other/DebugUrlsMenu';

const ReconnectingOverlay = ({ visible }) => {
  const [initilized, setInitilized] = useState(false);
  const [render, setRender] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const { customUrls } = useCurrentUser();

  useEffect(() => {
    setRender(true);
    const anim = Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 300,
      delay: initilized === false ? 2000 : 0,
      useNativeDriver: true,
      easing: Easing.ease,
    });
    anim.start(({ finished }) => {
      if (finished)
        setRender(visible);
    });
    if (visible)
      setInitilized(true);

    return anim.stop;
  }, [visible]);

  const translateValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [responsiveHeight(10), 0],
  });

  if (!render)
    return null;

  return (
    <Animated.View style={{ ...styles.container, opacity: animatedValue }}>
      <Animated.View style={{ ...styles.animatedContainer, transform: [{ translateY: translateValue }] }}>
        <View style={styles.alertContainer}>
          {customUrls && <DebugUrlsMenu />}
          <View style={Styles.center}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>{'On t\'as perdu...'}</Text>
            <Text style={{ ...Fonts.regular(13, Colors.white), marginTop: 7 }}>{'Ne bouge pas, on te reconnecte !'}</Text>
          </View>
          <LoadingSpinner color={Colors.white} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default ReconnectingOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
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
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: Colors.purple2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
