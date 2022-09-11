import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Easing
} from 'react-native';
import React, { useRef, useState , useEffect } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign , MaterialCommunityIcons , FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import OnboardingLines from '../assets/svgs/onboarding_lines.svg';
import GlassButton from '../components/GlassButton';
import FormInput from '../components/FormInput';
import FormCheckBox from '../components/FormCheckBox';
import ViewSlider from '../components/ViewSlider';
export default function Onboarding() {

  const translateWavesAnimatedValue = useRef(new Animated.Value(0)).current;

  const [currentViewIndex, setCurrentViewIndex] = useState(0);


  useEffect(() => {
    const anim = Animated.timing(translateWavesAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 600,
      useNativeDriver: true,
      easing: Easing.bezier(.44,.23,.06,1.04),
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

      <ViewSlider onViewIndexChanged={setCurrentViewIndex}>
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

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={{ ...Fonts.bold(20, Colors.darkGrey), textAlign: 'center' }}>We need you to turn on geolocation</Text>
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey) }}>{'Or you won\'t be able to use the app'}</Text>
          </View>
          <MaterialIcons name="location-pin" size={60} color={Colors.grey} />
          <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 50, paddingVertical: 10, marginBottom: 60 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={{ ...Fonts.bold(20, Colors.darkGrey), textAlign: 'center' }}>{'Don\'t miss your personnal messages '}</Text>
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey) }}>Turn on notifications</Text>
          </View>
          <MaterialCommunityIcons name="bell-ring" size={60} color="grey" />
          <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 50, paddingVertical: 10, marginBottom: 60 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={{ ...Fonts.bold(20, Colors.darkGrey), textAlign: 'center' }}>{'Don\'t miss drops around you'}</Text>
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), textAlign: 'center' }}>Turn on background geolocation and get notified when there are drops around you</Text>
            <TouchableOpacity>
              <Text style={{ ...Fonts.regular(13, Colors.mainBlue) }}>learn more</Text>
            </TouchableOpacity>
          </View>
          <FontAwesome5 name="satellite" size={60} color="grey" />
          <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 50, paddingVertical: 10, marginBottom: 60 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <Text style={styles.emoji}>😃</Text>
          <Text style={{ ...Fonts.bold(30, Colors.darkGrey) }}>Almost there !</Text>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <FormCheckBox text={'I agree with dropy\'s {terms & conditions}'}/>
            <FormCheckBox text={'subscribe to dropy\'s newsletter'}/>
          </View>
          <GlassButton onPress={() => setCurrentViewIndex(old => old + 1)} style={{ paddingHorizontal: 20, paddingVertical: 10, marginBottom: 40 }} >
            <AntDesign name="arrowright" size={32} color="white"/>
          </GlassButton>
        </View>
      </ViewSlider>
    </SafeAreaView>
  );
}

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
});
