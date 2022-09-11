import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Easing,
  Keyboard,
  Linking,
  Image
} from 'react-native';
import React, { useRef, useState , useEffect } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign , MaterialCommunityIcons , FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { openCamera, openPicker } from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import OnboardingLines from '../assets/svgs/onboarding_lines.svg';
import GlassButton from '../components/GlassButton';
import FormInput from '../components/FormInput';
import FormCheckBox from '../components/FormCheckBox';
import ViewSlider from '../components/ViewSlider';
import { compressImage } from '../utils/files';
import API from '../services/API';
import useOverlay from '../hooks/useOverlay';
import useCurrentUser from '../hooks/useCurrentUser';

export default function Onboarding({ navigation }) {

  const translateWavesAnimatedValue = useRef(new Animated.Value(0)).current;
  const viewSliderRef = useRef(null);
  const displayNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmationInputRef = useRef(null);

  const { sendAlert } = useOverlay();
  const { setUser } = useCurrentUser();

  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [profilePicturePath, setProfilePicturePath] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [termsChecked, setTermsChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

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

  const onPressEditPicture = () => {
    const options = profilePicturePath == null ? {
      options: ['Take a photo', 'Choose from library', 'Cancel'],
      cancelButtonIndex: 2,
      title: 'Where do you want to get your picture from?',
    } : {
      options: ['Take a photo', 'Choose from library','Delete picture', 'Cancel'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
      title: 'Where do you want to get your picture from?',
    };

    showActionSheetWithOptions(options, (buttonIndex) => {
      if (buttonIndex === 0) {
        setProfilePictureFromCamera();
      } else if (buttonIndex === 1) {
        setProfilePictureFromLibrary();
      } else if (buttonIndex === 2) {
        setProfilePicturePath(null);
      }
    });
  };


  const setProfilePictureFromLibrary = async () => {
    try {
      const image = await openPicker({
        width: 600,
        height: 600,
        cropping: true,
        mediaType: 'photo',
      });
      const filePath = await compressImage(image.path);
      setProfilePicturePath(filePath);
    } catch (error) {
      if(error.code === 'E_NO_LIBRARY_PERMISSION') {
        const alertResult = await sendAlert({
          title: 'Library access not granted...',
          description: 'Enable access in your settings',
          validateText: 'Open settings',
          denyText: 'Ok !',
        });
        if(alertResult) {
          Linking.openSettings();
        }
      }
      console.error('Open camera error', error);
    }
  };

  const setProfilePictureFromCamera = async () => {
    try {
      const image = await openCamera({
        width: 600,
        height: 600,
        cropping: true,
        mediaType: 'photo',
      });
      const filePath = await compressImage(image.path);
      setProfilePicturePath(filePath);
    } catch (error) {
      if(error.code === 'E_NO_CAMERA_PERMISSION') {
        const alertResult = await sendAlert({
          title: 'Camera not granted...',
          description: 'Enable camera access in your settings',
          validateText: 'Open settings',
          denyText: 'Ok !',
        });
        if(alertResult) {
          Linking.openSettings();
        }
      }
      console.error('Open camera error', error);
    }
  };

  const handleRegister = async () => {
    try {
      const userInfos = await API.register(
        displayName,
        email,
        password,
        newsletterChecked
      );
      if (profilePicturePath) {
        // const response = await API.postProfilePicture(profilePicturePath);
        // const avatarUrl = response.data;
        // setUser({
        //   ...userInfos,
        //   avatarUrl,
        // });
      } else {
        // PUTE
      }
      setUser(userInfos);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      const userInfos = await API.login(email, password);
      setUser(userInfos);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentViewIndex === 0 && (
        <View style={{ transform: [{ scaleX: -1 }], width: responsiveWidth(100) }}>
          <GoBackHeader onPressGoBack={() => viewSliderRef.current?.nextView()}/>
        </View>
      )}
      {currentViewIndex > 1 && (
        <GoBackHeader onPressGoBack={() => viewSliderRef.current?.previousView()}/>
      )}
      {currentViewIndex === 1 && (
        <DropyLogo height={70} width={70}/>
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

      <ViewSlider ref={viewSliderRef} onViewIndexChanged={setCurrentViewIndex}>

        <View style={styles.view}>
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Welcome back !</Text>
          <FormInput
            placeholder="email"
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            onChangeText={setEmail}
          />
          <FormInput
            placeholder="password"
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            isPassword={true}
            onChangeText={setPassword}
          />
          <GlassButton
            onPress={handleLogin}
            style={{ ...styles.nextButton, paddingVertical: 15, width: 150 }}
          >
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>Login</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <Text style={{ fontSize: 40 }}>👋</Text>
          <View style={{ ...Styles.center }}>
            <Text style={{ ...styles.title, fontSize: 35 }}>Hey there</Text>
            <Text style={{ ...styles.subtitle, fontSize: 20 }}>ready to drop ?</Text>
          </View>
          <GlassButton onPress={() => viewSliderRef.current?.nextView()} style={styles.nextButton}>
            <AntDesign name="arrowright" size={32} color="white"/>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <Text style={styles.title}>{'Let\'s start gently'}</Text>
          <FormInput
            placeholder="What's your name"
            maxLength={25}
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            onEdited={setDisplayName}
            ref={displayNameInputRef}
            minLength={3}
          />
          <GlassButton
            disabled={displayName === ''}
            onPress={() => {
              const isValid = displayNameInputRef.current?.isValid();
              isValid && viewSliderRef.current?.nextView();
              isValid && Keyboard.dismiss();
            }}
            style={styles.nextButton}
          >
            <AntDesign name="arrowright" size={32} color="white"/>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>Show me your smile !</Text>
            <Text style={styles.subtitle}>Set a profile picture</Text>
          </View>
          <TouchableOpacity onPress={onPressEditPicture} style={{ ...Styles.center, width: 100, height: 100, borderRadius: 30, backgroundColor: Colors.purple3, overflow: 'hidden' }}>
            {profilePicturePath ? (
              <Image source={{ uri: profilePicturePath }} style={{ ...StyleSheet.absoluteFillObject }}/>
            ) : (
              <MaterialCommunityIcons name="image-plus" size={40} color="white" />
            )}
          </TouchableOpacity>
          <GlassButton disabled={profilePicturePath == null} onPress={() => viewSliderRef.current?.nextView()}
            style={styles.nextButton} >
            <AntDesign name="arrowright" size={32} color="white"/>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Secure your account !</Text>
          <FormInput
            ref={emailInputRef}
            onEdited={setEmail}
            placeholder="email"
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            isEmail={true}/>
          <FormInput
            ref={passwordInputRef}
            onEdited={setPassword}
            placeholder="password"
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            isPassword={true}/>
          <FormInput
            ref={passwordConfirmationInputRef}
            onEdited={setPasswordConfirmation}
            placeholder="confirm password"
            style={{ width: '80%' }}
            inputStyle={{ backgroundColor: Colors.lighterGrey }}
            isPassword={true}/>
          <GlassButton
            disabled={email === '' || password === '' || passwordConfirmation === ''}
            onPress={() => {
              const emailValid = emailInputRef.current?.isValid();
              const passwordValid = passwordInputRef.current?.isValid();
              const passwordConfirmationValid = passwordConfirmationInputRef.current?.isValid();
              const samePasswords = passwordInputRef.current?.getValue() === passwordConfirmationInputRef.current?.getValue();
              if (!samePasswords) {
                passwordInputRef.current?.setInvalid();
                passwordConfirmationInputRef.current?.setInvalid();
              }
              const isValid = emailValid && passwordValid && passwordConfirmationValid && samePasswords;
              isValid && viewSliderRef.current?.nextView();
              isValid && Keyboard.dismiss();
            }}
            style={styles.nextButton}
          >
            <AntDesign name="arrowright" size={32} color="white"/>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>We need you to Turn on geolocation</Text>
            <Text style={styles.subtitle}>{'Or you won\'t be able to use the app'}</Text>
          </View>
          <MaterialIcons name="location-pin" size={60} color={Colors.grey} />
          <GlassButton onPress={() => viewSliderRef.current?.nextView()} style={{ ...styles.nextButton, paddingVertical: 15, width: 150 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>Turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>{'Don\'t miss your personnal messages '}</Text>
            <Text style={styles.subtitle}>Turn on notifications</Text>
          </View>
          <MaterialCommunityIcons name="bell-ring" size={50} color={Colors.grey} />
          <GlassButton onPress={() => viewSliderRef.current?.nextView()} style={{ ...styles.nextButton, paddingVertical: 15, width: 150 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>Turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>{'Don\'t miss drops around you'}</Text>
            <Text style={styles.subtitle}>Turn on background geolocation and get notified when there are drops around you</Text>
            <TouchableOpacity>
              <Text style={{ ...Fonts.regular(13, '#44a0eb'), marginTop: 5, textDecorationLine: 'underline' }}>learn more</Text>
            </TouchableOpacity>
          </View>
          <FontAwesome5 name="satellite" size={50} color={Colors.grey} />
          <GlassButton onPress={() => viewSliderRef.current?.nextView()} style={{ ...styles.nextButton, paddingVertical: 15, width: 150 }}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>Turn on</Text>
          </GlassButton>
        </View>

        <View style={styles.view}>
          <Text style={styles.emoji}>😃</Text>
          <Text style={{ ...Fonts.bold(30, Colors.darkGrey) }}>Almost there !</Text>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <FormCheckBox text={'I agree with dropy\'s {terms & conditions}'} onChanged={setTermsChecked}/>
            <FormCheckBox text={'subscribe to dropy\'s newsletter'} onChanged={setNewsletterChecked}/>
          </View>
          <GlassButton onPress={handleRegister} style={{ ...styles.nextButton, paddingVertical: 15, width: 150 }} disabled={!termsChecked}>
            <Text style={{ ...Fonts.bold(15, Colors.white) }}>Start</Text>
          </GlassButton>
        </View>
      </ViewSlider>
    </SafeAreaView>
  );
}

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
    top: -70,
    position: 'absolute',
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 40,
    marginTop: '10%',
  },
  title: {
    ...Fonts.bold(20, Colors.darkGrey),
    textAlign: 'center',
  },
  subtitle: {
    ...Fonts.bold(13, Colors.darkGrey),
    marginTop: 5,
    textAlign: 'center',
    maxWidth: responsiveWidth(80),
  },
});
