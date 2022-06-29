import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import {  responsiveWidth } from 'react-native-responsive-dimensions';
import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';

import Styles, { Colors } from '../styles/Styles';


import DropyPopup from '../assets/svgs/dropyPopup.svg';

export const OVERLAY_STATE = {
  HIDDEN: 'HIDDEN',
  CONFIRMATION_PENDING: 'CONFIRMATION_PENDING',
  LOADING_POST: 'LOADING_POST',
  POST_SUCCESS: 'POST_SUCCESS',
  POST_FAILURE: 'POST_FAILURE',
};

const AnimatedDropPreviewBox = ({ filePath, overlayState = OVERLAY_STATE.CONFIRMATION_PENDING, onPress }) => {

  const scaleAnimatedValue = useRef(new Animated.Value(0.5)).current;
  const rotationAnimatedValue = useRef(new Animated.Value(0)).current;
  const opacityAnimatedValue = useRef(new Animated.Value(0)).current;
  const previewTranslateYAnimatedValue = useRef(new Animated.Value(0)).current;

  const dropyPopupRotationAnimatedValue = useRef(new Animated.Value(0)).current;
  const dropyPopupOpacityAnimatedValue = useRef(new Animated.Value(0)).current;

  const animRef = useRef(null);

  useEffect(() => {
    animRef.current?.stop();

    if(overlayState === OVERLAY_STATE.CONFIRMATION_PENDING)
      animRef.current = openAnimation();
    else if (overlayState === OVERLAY_STATE.LOADING_POST)
      animRef.current = loadingAnimationLoop();

    return animRef.current?.stop;
  }, [overlayState]);

  const openAnimation = () => {
    scaleAnimatedValue.setValue(0.5);
    rotationAnimatedValue.setValue(0);
    previewTranslateYAnimatedValue.setValue(0);
    const anim = Animated.parallel([
      Animated.timing(scaleAnimatedValue, {
        toValue: 1,
        duration: 300,
        delay: 600,
        useNativeDriver: true,
        easing: Easing.elastic(1.4),
      }),
      Animated.timing(opacityAnimatedValue, {
        toValue: 1,
        duration: 300,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(dropyPopupOpacityAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]);
    anim.start();
    return anim;
  };

  const loadingAnimationLoop = () => {
    Animated.parallel([
      Animated.timing(scaleAnimatedValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(previewTranslateYAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimatedValue, {
        toValue: 0,
        delay: 200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dropyPopupOpacityAnimatedValue, {
        toValue: 1,
        delay: 200,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(dropyPopupRotationAnimatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.elastic(1.1),
        }),
        Animated.timing(dropyPopupRotationAnimatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.elastic(1.1),
        })
      ])
    );
    anim.start();
    return anim;
  };

  const dropyPopupScaleX = dropyPopupRotationAnimatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.7, 1],
  });

  const dropyPopupScaleY = dropyPopupRotationAnimatedValue.interpolate({
    inputRange: [0, 0.5 ,1],
    outputRange: [1, 1.2, 1],
  });

  const previewTranslateY = previewTranslateYAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, responsiveWidth(40)],
  });

  return (
    <TouchableOpacity style={previewStyles.container} onPress={onPress}>
      <Animated.View style={{
        ...previewStyles.dropyPreviewContainer,
        opacity: opacityAnimatedValue,
        transform: [{ translateY: previewTranslateY }, { scale : scaleAnimatedValue }] }}
      >
        {filePath != null ? (
          <>
            <Image source={{ uri: filePath }} style={previewStyles.previewImage}/>
            <View style={previewStyles.previewImageOverlay} />
            <Ionicons name="ios-camera-outline" size={80} color={Colors.white} style={previewStyles.cameraIcon}/>
          </>
        ) : (
          <MaterialCommunityIcons name="draw-pen" size={80} color={Colors.mainBlue} style={Styles.blueShadow}/>
        )}
      </Animated.View>
      <Animated.View style={{
        ...previewStyles.dropyPopup,
        opacity: dropyPopupOpacityAnimatedValue,
        transform: [{ scaleX: dropyPopupScaleX }, { scaleY: dropyPopupScaleY }],
      }}>
        <DropyPopup style={previewStyles.dropySvg}></DropyPopup>
        <Entypo style={{ position: 'absolute', bottom: '47%' }} name="dots-three-horizontal" size={24} color={Colors.darkGrey} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedDropPreviewBox;

const previewStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    ...Styles.center,
  },
  dropyPreviewContainer: {
    position: 'absolute',
    top: '-60%',
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 30,
    ...Styles.center,
    ...Styles.softShadows,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  previewImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    borderRadius: 15,
  },
  cameraIcon: {
    position: 'absolute',
  },
  dropyPopup: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
    height: '100%',
    ...Styles.center,
  },
});

