import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import { createDropTimeString } from '../../utils/time';
import GlassButton from '../input/GlassButton';
import ProfileImage from '../profile/ProfileImage';


const FooterConfirmation = ({ dropy, onPress, textButton }) => {
  const displayAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(displayAnimation, {
      toValue: 1,
      delay: 500,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.elastic(1),
    });
    anim.start();
    return anim.stop;
  }, []);

  const displayCardAnimation = displayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (

    <Animated.View style={{ ...styles.container, transform: [{ translateY: displayCardAnimation }] }}>
      <View style={styles.infoContainer}>
        <View style={styles.pictureContainer}>
          <ProfileImage
            width={65}
            height={65}
            resizeMode='cover'
            avatarUrl={dropy.emitter.avatarUrl}
            displayName={dropy.emitter.displayName}
          />
        </View>
        <View style={styles.infoDropy}>
          <Text style={styles.profileName}>@{dropy.emitter.displayName}</Text>
          <Text style={styles.dropyDate}>Dropped here {createDropTimeString(new Date() - new Date(dropy.creationDate))} ago</Text>
        </View>
      </View>
      <GlassButton onPress={onPress} buttonText={textButton} style={{ height: 50 }} />
    </Animated.View >
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    backgroundColor: Colors.white,
    borderRadius: 25,
    width: '95%',
    padding: 15,
    ...Styles.hardShadows,
  },
  pictureContainer: {
    width: 65,
    height: 65,
    borderRadius: 25,
    marginRight: 10,
    ...Styles.softShadows,
    overflow: 'hidden',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
  },
  infoDropy: {
    justifyContent: 'center',
  },
  profileName: {
    ...Fonts.bold(20, Colors.darkGrey),
  },
  dropyDate: {
    ...Fonts.regular(14, Colors.darkGrey),
  },
});

export default FooterConfirmation;
