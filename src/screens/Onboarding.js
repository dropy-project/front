import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Easing,
  BackHandler
} from 'react-native';
import React, { useRef, useState , useEffect } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign , MaterialCommunityIcons } from '@expo/vector-icons';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import OnboardingLines from '../assets/svgs/onboarding_lines.svg';
import GlassButton from '../components/GlassButton';
import FormInput from '../components/FormInput';

export default function Onboarding() {

  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const translateViewAnimatedValue = useRef(new Animated.Value(0)).current;
  const translateWavesAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setCurrentViewIndex(old => {
        if(old - 1 < 0) return old;
        return old - 1;
      });
      return true;
    });
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.timing(translateViewAnimatedValue, {
        toValue: currentViewIndex * -responsiveWidth(100),
        duration: 500,
        useNativeDriver: true,
      //   easing: Easing.ease,
      }),
      Animated.timing(translateWavesAnimatedValue, {
        toValue: currentViewIndex * -responsiveWidth(100),
        duration: 600,
        useNativeDriver: true,
        easing: Easing.bezier(.44,.23,.06,1.04),
      })
    ]);
    anim.start();
    return () => anim.stop();
  }, [currentViewIndex]);

  return (
    <SafeAreaView style={styles.container}>
      {currentViewIndex > 0 && (
        <GoBackHeader onPressGoBack={() => setCurrentViewIndex(old => old - 1)}/>
      )}
      {currentViewIndex === 0 && (
        <DropyLogo height={70} width={70} color={'green'}/>
      )}
      <Animated.View style={{
        position: 'absolute',
        top: responsiveHeight(10),
        left: 0,
        width: (responsiveWidth(100)) * 8,
        height: responsiveHeight(30),
        transform: [{ translateX: Animated.add(translateWavesAnimatedValue, -50) }],
      }}>
        <OnboardingLines width={'100%'} height={'100%'} />
      </Animated.View>
      <View>

        <View style={styles.viewContainer}>
          <Animated.View style={{ transform: [{ translateX: translateViewAnimatedValue }], flexDirection: 'row' }}>
            <View style={styles.view}>
              <Text style={styles.emoji}>👋</Text>
              <View style={{ marginBottom: 30, ...Styles.center }}>
                <Text style={{ ...Fonts.bold(30, Colors.darkGrey) }}>Hey there</Text>
                <Text style={{ ...Fonts.bold(15, Colors.lightGrey) }}>ready to drop ?</Text>
              </View>
              <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10, marginBottom: 40 }} >
                <AntDesign name="arrowright" size={32} color="white"/>
              </GlassButton>
            </View>
            <View style={styles.view}>
              <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>{'Let\'s start gently'}</Text>
              <FormInput placeholder="What's your name" maxLength={25} style={{ width: '80%' }} inputStyle={{ backgroundColor: Colors.lighterGrey }} />
              <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10, marginBottom: 40 }} >
                <AntDesign name="arrowright" size={32} color="white"/>
              </GlassButton>
            </View>
            <View style={styles.view}>
              <View style={{ marginBottom: 30, ...Styles.center }}>
                <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Show me your smile !</Text>
                <Text style={{ ...Fonts.bold(13, Colors.darkGrey) }}>Set a profile picture</Text>
              </View>
              <ProfilePictureContainer/>
              <GlassButton disabled={false} onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10, marginBottom: 40 }} >
                <AntDesign name="arrowright" size={32} color="white"/>
              </GlassButton>
            </View>
            <View style={styles.view}>
              <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Secure your account !</Text>
              <FormInput placeholder="email" maxLength={25} style={{ width: '80%' }} inputStyle={{ backgroundColor: Colors.lighterGrey }} />
              <FormInput placeholder="password" style={{ width: '80%' }} inputStyle={{ backgroundColor: Colors.lighterGrey }} isPassword={true}/>
              <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10, marginBottom: 40 }} >
                <AntDesign name="arrowright" size={32} color="white"/>
              </GlassButton>
            </View>
          </Animated.View>
        </View>
        {currentViewIndex === 0 ? (
          <TouchableOpacity style={{ ...Styles.center, position: 'absolute', bottom: 0, alignSelf: 'center' }}>
            <Text style={{ marginBottom: 20, ...Fonts.bold(13, Colors.grey) }}>I already have an account</Text>
          </TouchableOpacity>
        ) : (
          <DotIndicator currentIndex={currentViewIndex - 1} />
        )}
      </View>
    </SafeAreaView>
  );
}

const DotIndicator = ({ currentIndex, isSkippable = true }) => {
  const dots = [];
  for (let i = 0; i < 7; i++) {
    dots.push(
      <View key={i} style={{ ...styles.dot, backgroundColor: currentIndex === i ? Colors.grey : Colors.lightGrey }} />
    );
  }
  return (
    <View style={styles.indicatorContainer}>
      {dots}
      {isSkippable && (
        <TouchableOpacity>
          <Text style={styles.skipText}>skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ProfilePictureContainer = ({ onPress }) => {

  return (
    <TouchableOpacity onPress={onPress} style={{ ...Styles.center, width: 100, height: 100, borderRadius: 30, backgroundColor: Colors.purple3 }}>
      <MaterialCommunityIcons name="image-plus" size={40} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Styles.center,
    justifyContent: 'space-between',
    ...Styles.safeAreaView,
  },
  viewContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    // borderColor: 'blue',
    // borderWidth: 1,
    flexDirection: 'row',
  },
  view: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 30,
  },
  emoji: {
    fontSize: 40,
    marginTop: 20,
  },
  // Dot indicator component
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center' ,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  skipText: {
    ...Fonts.bold(13, Colors.darkGrey),
    position: 'absolute',
    bottom: -10,
    right: -60,
  },

});
