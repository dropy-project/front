import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
// import Haptic from 'react-native-haptic-feedback';


import { useNavigation } from '@react-navigation/native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { mediaIsFile } from '../utils/mediaTypes';
import API from '../services/API';

import useCurrentUser from '../hooks/useCurrentUser';
import useGeolocation from '../hooks/useGeolocation';

import GlassButton from './GlassButton';
import ProfileAvatar from './ProfileAvatar';
import GoBackHeader from './GoBackHeader';

const ConfirmDropOverlay = ({ visible = false, onCloseOverlay: closeOverlay = () => {}, dropyCreateParams }) => {

  const navigation = useNavigation();

  const [render, setRender] = useState(visible);
  const fadeAnimatedValue = useRef(new Animated.Value(0)).current;

  const { user } = useCurrentUser();
  const { userCoordinates } = useGeolocation();

  useEffect(() => {
    console.log(dropyCreateParams);
    setRender(true);
    const anim = Animated.timing(fadeAnimatedValue, {
      toValue: visible ? 1 : 0,
      delay: visible ? 500 : 0,
      duration: visible ? 600 : 300,
      useNativeDriver: true,
      easing: Easing.elastic(1.2),
    });
    anim.start(({ finished }) => {
      finished && setRender(visible);
    });
    return anim.stop;
  }, [visible]);

  const sendDrop = async () => {
    try {
      // Haptic.trigger('impactMedium');
      const dropy = await API.createDropy(user.id, userCoordinates.latitude, userCoordinates.longitude);
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
      closeOverlay();
    }
  };

  const goBackToOriginRoute = () => {
    if(dropyCreateParams.originRoute != null) {
      closeOverlay();
      navigation.navigate(dropyCreateParams.originRoute, { dropyData: dropyCreateParams?.dropyData });
    }
  };

  const animatedScale = fadeAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if(!render || dropyCreateParams == null) return null;

  return (
    <Animated.View style={{ ...StyleSheet.absoluteFillObject, opacity: fadeAnimatedValue }}>
      <LinearGradient colors={['rgba(255, 255, 255, 0)', Colors.white]} end={{ x: 0.5, y: 0.85 }} style={StyleSheet.absoluteFillObject}>
        <SafeAreaView style={styles.container}>
          <GoBackHeader onPressGoBack={closeOverlay}/>
          <TouchableOpacity onPress={goBackToOriginRoute}>
            <Animated.View style={{ ...styles.dropyPreviewContainer, transform: [{ scale : animatedScale }] }}>
              {dropyCreateParams.dropyFilePath != null ? (
                <>
                  <Image source={{ uri: dropyCreateParams.dropyFilePath }} style={styles.previewImage}/>
                  <View style={styles.previewImageOverlay} />
                  <Ionicons name="ios-camera-outline" size={80} color={Colors.white} style={styles.cameraIcon}/>
                </>
              ) : (
                <MaterialCommunityIcons name="draw-pen" size={80} color={Colors.mainBlue} style={Styles.blueShadow}/>
              )}
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.avatarsContainer}>
            <ProfileAvatar size={100} style={{ transform: [{ rotate: '-30deg' }] }} />
            <Entypo name="plus" size={35} color={Colors.lightGrey} />
            <ProfileAvatar size={100} style={{ transform: [{ rotate: '30deg' }] }} showQuestionMark />
          </View>
          <Animated.View style={{ ...styles.bottomContainer, transform: [{ scale : animatedScale }] }}>
            <Text style={styles.dropText}>{'It\'s time to drop this into the unkown'}</Text>
            <GlassButton buttonText="DROP !" onPress={sendDrop} style={styles.dropButtonStyle} fontSize={18} />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};

export default ConfirmDropOverlay;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropyPreviewContainer: {
    padding: 25,
    backgroundColor: Colors.white,
    borderRadius: 30,
    minHeight: 170,
    minWidth: 170,
    ...Styles.center,
    ...Styles.softShadows,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
  },
  previewImageOverlay: {
    position: 'absolute',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    borderRadius: 15,
  },
  cameraIcon: {
    position: 'absolute',
  },
  avatarsContainer: {
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
