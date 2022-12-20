import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Colors, Fonts } from '../styles/Styles';

import DropyLogo from '../assets/svgs/dropy_logo.svg';
import ParticleEmitter from '../components/effect/ParticleEmitter';
import FooterConfirmation from '../components/other/FooterConfirmation';
import GoBackHeader from '../components/other/GoBackHeader';
import API from '../services/API';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import useDropiesAroundSocket from '../hooks/useDropiesAroundSocket';


const GetDropyScreen = ({ navigation, route }) => {
  const { dropy = null } = route.params || {};
  const { setUser } = useCurrentUser();
  const { sendBottomAlert, sendAlert } = useOverlay();
  const { retrieveDropy } = useDropiesAroundSocket();

  const circleAnimation = useRef(new Animated.Value(0)).current;
  const circleBreathing = useRef(new Animated.Value(0)).current;
  const [dropyInfo, setDropyInfo] = useState(undefined);

  useEffect(() => {
    getDropyInfo(dropy);
  }, []);

  useEffect(() => {
    const anim = Animated.sequence([
      Animated.timing(circleAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
      Animated.delay(1500)
    ]);
    anim.start();
    return anim.stop;
  }, []);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(circleBreathing, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(circleBreathing, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ])
    );
    anim.start();
    return anim.stop;
  }, []);

  const bigCircle = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const largeCircle = circleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const breathing = circleBreathing.interpolate({
    inputRange: [0, 1],
    outputRange: [0.97, 1],
  });

  const getDropyInfo = async (dropy) => {
    try {
      const response = await API.getUnretrievedDropyInfos(dropy.id);
      setDropyInfo(response.data);
    } catch (error) {
      console.error(`Error when retrieving data from a drop not retrieved`, error);
    }
  };

  const handleConfirmation = async (dropy) => {
    try {
      const result = await retrieveDropy(dropy.id);
      console.log(result.data);
      if (result.error != null) {
        if (result.status === 406) {
          await sendAlert({
            title: 'Oh non, tu es à cours d\'énergie !',
            description: 'N\'attends pas, recharge la en posant un drop !',
            validateText: 'Ok !',
          });
          return;
        }
        throw result.error;
      }

      navigation.reset({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'DisplayDropyMedia', params: { dropy: result.data, showBottomModal: true } }],
      });
      setTimeout(() => {
        setUser((oldUser) => ({
          ...oldUser,
          energy: result.data.newEnergy,
          lastEnergyIncrement: result.data.newEnergy - result.data.oldEnergy,
        }));
      }, 500);
    } catch (error) {
      console.error('Dropy pressed error', error);
      sendBottomAlert({
        title: 'Oups...',
        description: 'Le drop a été perdu en chemin\nVérifie ta connexion internet',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      <ParticleEmitter particlesColor={Colors.lighterGrey} />
      <View style={styles.containerImage}>
        <Text style={styles.topText}>{'Tu viens de trouver'}</Text>
        <DropyLogo height={87} width={87} />
        <Text style={styles.bottomText}>un nouveau drop !</Text>
        <Animated.View style={{ ...styles.largeCircle, transform: [{ scale: Animated.multiply(breathing, circleAnimation) }] }} />
        <Animated.View style={{ ...styles.largerCircle, transform: [{ scale: Animated.multiply(breathing, bigCircle) }] }} />
        <Animated.View style={{ ...styles.bigCircle, transform: [{ scale: Animated.multiply(breathing, largeCircle) }] }} />
      </View>
      { dropyInfo && <FooterConfirmation dropy={dropyInfo} onPress={() => handleConfirmation(dropyInfo)} textButton='Ouvrir le drop !'/>}
    </SafeAreaView>
  );
};

export default GetDropyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  containerImage: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    ...Fonts.regular(18, Colors.darkGrey),
    marginBottom: 30,
  },
  bottomText: {
    ...Fonts.bold(18, '#7B6DCD'),
    marginTop: 30,
  },
  largeCircle: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#94B2DE',
    borderStyle: 'solid',
  },
  largerCircle: {
    position: 'absolute',
    width: 613,
    height: 613,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#dac9f2',
    borderStyle: 'solid',
  },
  bigCircle: {
    position: 'absolute',
    width: 647,
    height: 647,
    borderRadius: 500,
    borderWidth: 9,
    borderColor: '#b48eff',
    borderStyle: 'solid',
  },
});
