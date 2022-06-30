import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Entypo } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';

import { useNavigation } from '@react-navigation/native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { mediaIsFile } from '../utils/mediaTypes';
import API from '../services/API';

import useGeolocation from '../hooks/useGeolocation';

import Haptics from '../utils/haptics';

import GlassButton from './GlassButton';
import ProfileAvatar from './ProfileAvatar';
import GoBackHeader from './GoBackHeader';
import AnimatedDropyPreviewBox, { OVERLAY_STATE } from './AnimatedDropyPreviewBox';

const ConfirmDropyOverlay = ({ visible = false, onCloseOverlay: closeOverlay = () => {}, dropyCreateParams }) => {

  const navigation = useNavigation();

  const [render, setRender] = useState(visible);
  const [antiSpamOn, setAntiSpamOn] = useState(false);

  const fadeAnimatedValue = useRef(new Animated.Value(0)).current;
  const bottomContainerScaleAnimatedValue = useRef(new Animated.Value(0)).current;

  const { userCoordinates } = useGeolocation();

  const [overlayState, setOverlayState] = useState(OVERLAY_STATE.HIDDEN);

  useEffect(() => {
    setRender(true);
    setAntiSpamOn(false);
    setOverlayState(visible ? OVERLAY_STATE.CONFIRMATION_PENDING : OVERLAY_STATE.HIDDEN);

    const anim = Animated.timing(fadeAnimatedValue, {
      toValue: visible ? 1 : 0,
      delay: visible ? 500 : 0,
      duration: visible ? 600 : 300,
      useNativeDriver: true,
      easing: Easing.elastic(1.1),
    });

    anim.start(({ finished }) => {
      if(finished)
        setRender(visible);
    });

    return anim.stop;
  }, [visible]);

  useEffect(() => {
    const anim = Animated.timing(bottomContainerScaleAnimatedValue, {
      toValue: overlayState === OVERLAY_STATE.CONFIRMATION_PENDING ? 1 : 0,
      delay: overlayState === OVERLAY_STATE.CONFIRMATION_PENDING ? 600 : 0,
      duration: 400,
      easing: overlayState === OVERLAY_STATE.CONFIRMATION_PENDING ? Easing.elastic(1.2) : Easing.linear,
      useNativeDriver: true,
    });
    anim.start();
    return anim.stop;
  }, [overlayState]);

  const sendDrop = async () => {
    if(antiSpamOn) return;
    try {
      Haptics.impactHeavy();
      setAntiSpamOn(true);
      setOverlayState(OVERLAY_STATE.LOADING_POST);
      const dropy = await API.createDropy(userCoordinates.latitude, userCoordinates.longitude);
      if(mediaIsFile(dropyCreateParams.mediaType)) {
        const mediaResult = await API.postDropyMediaFromPath(dropy.id, dropyCreateParams.dropyFilePath, dropyCreateParams.mediaType);
        console.log('[File upload] API response', mediaResult.data);
      } else {
        const mediaResult = await API.postDropyMediaData(dropy.id, dropyCreateParams.dropyData, dropyCreateParams.mediaType);
        console.log('[Data upload] API response', mediaResult.data);
      }
    } catch (error) {
      console.log('Error while creating dropy', error?.response?.data || error);
    } finally {
      setTimeout(() => {
        Haptics.notificationSuccess();
        closeOverlay();
      }, 1300);
    }
  };

  const goBackToOriginRoute = () => {
    if(dropyCreateParams.originRoute != null) {
      closeOverlay();
      navigation.navigate(dropyCreateParams.originRoute, { ...dropyCreateParams });
    }
  };

  if(!render || dropyCreateParams == null) return null;

  return (
    <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnimatedValue }}>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 0.9 }}
        style={StyleSheet.absoluteFillObject}
      >
        <SafeAreaView style={styles.container}>
          <GoBackHeader onPressGoBack={closeOverlay}/>
          <View style={[StyleSheet.absoluteFillObject, Styles.center]}>
            <AnimatedDropyPreviewBox filePath={dropyCreateParams.dropyFilePath} overlayState={overlayState} onPress={goBackToOriginRoute} />
          </View>
          <Animated.View style={{ ...styles.avatarsContainer, transform: [{ scale: bottomContainerScaleAnimatedValue }] }}>
            <ProfileAvatar size={100} style={{ transform: [{ rotate: '-30deg' }] }} />
            <Entypo name="plus" size={35} color={Colors.lightGrey} />
            <ProfileAvatar size={100} style={{ transform: [{ rotate: '30deg' }] }} showQuestionMark />
          </Animated.View>
          <Animated.View style={{ ...styles.bottomContainer, transform: [{ scale : bottomContainerScaleAnimatedValue }] }}>
            <Text style={styles.dropText}>{'It\'s time to drop this into the unkown'}</Text>
            <GlassButton buttonText="DROP !" onPress={sendDrop} style={styles.dropButtonStyle} fontSize={18} />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};

export default ConfirmDropyOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarsContainer: {
    position: 'absolute',
    bottom: '30%',
    width: '100%',
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  bottomContainer: {
    marginBottom: responsiveHeight(3),
    width: '100%',
    alignItems: 'center',
  },
  dropText: {
    maxWidth: '90%',
    ...Fonts.bold(15, Colors.purple3),
    textAlign: 'center',
  },
  dropButtonStyle: {
    marginTop: 30,
    width: responsiveWidth(80),
    height: 45,
  },
});
