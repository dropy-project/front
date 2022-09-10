import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import React, { useRef, useState , useEffect } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign } from '@expo/vector-icons';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import OnboardingLines from '../assets/svgs/onboarding_lines.svg';
import GlassButton from '../components/GlassButton';

export default function Onboarding() {

  const [currentViewIndex, setCurrentViewIndex] = useState(0);

  const translateViewAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(translateViewAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 500,
      useNativeDriver: true,
    //   easing: Easing.ease,
    });
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
      <View style={{ ...StyleSheet.absoluteFillObject, width: (responsiveWidth(100) * 8), height: responsiveHeight(40), backgroundColor: 'red', transform: [{ translateX: -responsiveWidth(100) * 4 }] }}>
        <OnboardingLines width={(responsiveWidth(100) * 8)} height="100%" />
      </View>
      <View style={styles.viewContainer}>
        <Animated.View style={{ transform: [{ translateX: translateViewAnimatedValue }], flexDirection: 'row' }}>
          <View style={styles.view}>
            <Text style={styles.emoji}>👋</Text>
            <View style={{ marginBottom: 30 }}>
              <Text style={styles.title}>Hey there</Text>
              <Text style={styles.subtitle}>ready to drop ?</Text>
            </View>
            <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10 }} >
              <AntDesign name="arrowright" size={32} color="white"/>
            </GlassButton>
            <TouchableOpacity>
              <Text style={{ paddingBottom: 20, ...Fonts.bold(13, Colors.grey) }}>I already have an account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.view}>
            <Text>BITE to drop ?</Text>
            <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)}  style={{ paddingHorizontal: 50, paddingVertical: 10 }}>
              {/* <AntDesign name="arrowright" size={32} color="white"/> */}
              <Text style={{ ...Fonts.bold(16, Colors.white) }}>turn on</Text>
            </GlassButton>
          </View>

          <View style={styles.view}>
            <View>
              <Text>PUTE there</Text>
              <Text>ready to drop ?</Text>
            </View>
          </View>
        </Animated.View>
      </View>
      <DotIndicator currentIndex={currentViewIndex - 1} />
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
    borderColor: 'blue',
    borderWidth: 1,
    flexDirection: 'row',
  },
  view: {
    width: responsiveWidth(100),
    height: responsiveHeight(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 40,
    marginTop: 20,
  },
  title: {
    ...Fonts.bold(30, Colors.darkGrey),
  },
  subtitle: {
    ...Fonts.bold(15, Colors.lightGrey),

  },
  // Dot indicator component
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
