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
  Image,
  Platform
} from 'react-native';
import React, { useRef, useState , useEffect, useContext } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign , MaterialCommunityIcons , FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { openCamera, openPicker } from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { PERMISSIONS, request, requestNotifications, RESULTS } from 'react-native-permissions';
import BackgroundGeolocation from 'react-native-background-geolocation';
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
import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';
import LoadingSpinner from '../components/LoadingSpinner';

// eslint-disable-next-line no-undef
const DEBUG = __DEV__;

export default function Onboarding({ navigation }) {

  const { setBackgroundGeolocationEnabled } = useContext(BackgroundGeolocationContext);

  const translateWavesAnimatedValue = useRef(new Animated.Value(0)).current;
  const dropyLogoAnimatedValue = useRef(new Animated.Value(0)).current;

  const viewSliderRef = useRef(null);
  const displayNameInputRef = useRef(null);
  const loginEmailInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const passwordConfirmationInputRef = useRef(null);

  const { sendAlert } = useOverlay();
  const { user, setUser } = useCurrentUser();

  const [loading, setLoading] = useState(false);

  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [displayName, setDisplayName] = useState(DEBUG ? `Michel${Math.random() * 2000}` : '');
  const [profilePicturePath, setProfilePicturePath] = useState(null);
  const [email, setEmail] = useState(DEBUG ? 'michel.debug@dropy-app.com' : '');
  const [password, setPassword] = useState(DEBUG ? 'Michel1234SuperSecu' : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(DEBUG ? 'Michel1234SuperSecu' : '');

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

  useEffect(() => {
    const anim = Animated.timing(dropyLogoAnimatedValue, {
      toValue: currentViewIndex === 1 ? 1 : 0,
      duration: currentViewIndex === 1 ? 600 : 200,
      useNativeDriver: true,
      easing: currentViewIndex === 1 ? Easing.elastic(1.5) : Easing.bezier(.43,-0.59,.4,.64),
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
    setLoading(true);
    try {
      const userInfos = await API.register(
        displayName,
        email,
        password,
        newsletterChecked
      );
      if (profilePicturePath) {
        try {
          const response = await API.postProfilePicture(profilePicturePath);
          const avatarUrl = response.data;
          setUser({
            ...userInfos,
            avatarUrl,
          });
        } catch (error) {
          // If the profile picture upload fails, we still register the user
          console.error('Error while uploading profile picture', error, userInfos);
          setUser(userInfos);
        }
      } else {
        setUser(userInfos);
      }
    } catch (error) {
      setLoading(false);
      if(error.response.status === 409) {
        const validated = await sendAlert({
          title: 'This email is already registered',
          description: 'You can register instead',
          validateText: 'Register',
          denyText: 'Ok',
        });
        validated && viewSliderRef.current?.goToView(0);
        return;
      }
      sendAlert({
        title: 'Oups an error has occured',
        description: 'Check your internet connection',
        validateText: 'Ok',
      });
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const emailValid = loginEmailInputRef.current?.isValid();

    if(!emailValid) {
      console.log('email not valid');
      return;
    }

    try {
      const userInfos = await API.login(email, password);
      setUser(userInfos);
    } catch (error) {
      setLoading(false);
      if(error.response.status === 404) {
        sendAlert({
          title: 'This account does not exists',
          description: 'Check your email',
          validateText: 'Ok',
        });
        return;
      }
      if(error.response.status === 403) {
        sendAlert({
          title: 'Oups... invalid credentials',
          description: 'Check your email and password',
          validateText: 'Ok',
        });
        return;
      }
      sendAlert({
        title: 'Oups an error has occured',
        description: 'Check your internet connection',
        validateText: 'Ok',
      });
      console.error(error.response.data);
      console.error(error.response.status);
    }
  };

  useEffect(() => {
    if(user == null) return;
    console.log('Onboarding done sucessfully', user);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [user]);

  const handleGeolocationPermissions = async () => {
    let result = null;
    setLoading(true);

    if(Platform.OS === 'ios') {
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    switch(result) {
      case RESULTS.UNAVAILABLE:
        await sendAlert({
          title: 'Location not supported',
          description: 'You\'re device does not support location services',
        });
        break;
      case RESULTS.DENIED:
        notGrantedAlert('Location access');
        break;
      case RESULTS.BLOCKED:
        notGrantedAlert('Location access');
        break;
      case RESULTS.GRANTED:
        viewSliderRef.current?.goToView(6);
        break;
    }
    setLoading(false);
  };

  const handleNotificationsPermissions = async () => {
    setLoading(true);
    let result = await requestNotifications(['alert', 'sound', 'badge', 'criticalAlert']);

    switch(result.status) {
      case RESULTS.DENIED:
      case RESULTS.BLOCKED:
        viewSliderRef.current?.goToView(8);
        break;
      case RESULTS.GRANTED:
        viewSliderRef.current?.goToView(7);
        break;
    }

    setLoading(false);
  };

  const handleBackgroundGeolocationPermissions = async () => {
    setLoading(true);
    try {
      await BackgroundGeolocation.requestPermission();
      setBackgroundGeolocationEnabled(true);
    } catch (error) {
      console.error(error);
    } finally {
      viewSliderRef.current?.goToView(8);
      setLoading(false);
    }
  };

  const notGrantedAlert = async (serviceName) => {
    const alertResult = await sendAlert({
      title: `${serviceName} not granted`,
      description: `You need to grant ${serviceName.toLowerCase()} in your settings`,
      validateText: 'Open settings',
    });
    alertResult && Linking.openSettings();
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentViewIndex === 0 && (
        <GoBackHeader inverted onPressGoBack={() => {
          viewSliderRef.current?.nextView();
        }}/>
      )}
      {currentViewIndex > 1 && (
        <GoBackHeader onPressGoBack={() => {
          Keyboard?.dismiss();
          viewSliderRef.current?.previousView();
        }}/>
      )}

      {currentViewIndex === 1 && (
        <View />
      )}

      <Animated.View style={{
        position: 'absolute',
        top: responsiveHeight(100) < 800 ? 20 : 80,
        left: 0,
        width: (responsiveWidth(100)) * 8.5,
        height: responsiveWidth(55),
        transform: [
          { translateX: Animated.add(translateWavesAnimatedValue, -responsiveWidth(20)) }
        ],
      }}>
        <OnboardingLines preserveAspectRatio="xMinXMin slice" width={'120%'} height={'120%'} />
      </Animated.View>

      <Animated.View style={{
        position: 'absolute',
        top: responsiveHeight(10),
        transform: [{ scale: dropyLogoAnimatedValue }],
        ...Styles.center,
        opacity: dropyLogoAnimatedValue,
      }}>
        <DropyLogo height={70} width={70}/>
      </Animated.View>

      <ViewSlider ref={viewSliderRef} onViewIndexChanged={setCurrentViewIndex}>

        <View style={styles.view}>
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Welcome back !</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              ref={loginEmailInputRef}
              placeholder="Email"
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              onEdited={setEmail}
              isEmail
              defaultValue={email}
            />
            <FormInput
              placeholder="Password"
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              onEdited={setPassword}
              defaultValue={password}
            />
          </View>
          <LoadingGlassButton
            onPress={handleLogin}
            disabled={email.length === 0 || password.length === 0}
            text="Login"
          />
        </View>

        <View style={styles.view}>
          <Text style={{ fontSize: 40 }}>👋</Text>
          <View style={{ ...Styles.center }}>
            <Text style={{ ...styles.title, fontSize: 35 }}>Hey there</Text>
            <Text style={{ ...styles.subtitle, fontSize: 20 }}>ready to drop ?</Text>
          </View>
          <LoadingGlassButton
            onPress={() => viewSliderRef.current?.goToView(2)}
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.title}>{'Let\'s start gently'}</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              placeholder="What's your name"
              maxLength={25}
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              onEdited={setDisplayName}
              ref={displayNameInputRef}
              minLength={3}
              defaultValue={displayName}
            />
          </View>
          <LoadingGlassButton
            loading={loading}
            onPress={() => {
              const isValid = displayNameInputRef.current?.isValid();
              isValid && viewSliderRef.current?.goToView(3);
              isValid && Keyboard.dismiss();
            }}
            disabled={displayName === ''}
          />
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
          <LoadingGlassButton
            loading={loading}
            onPress={() => viewSliderRef.current?.goToView(4)}
            disabled={profilePicturePath == null}
          />
        </View>

        <View style={{ ...styles.view }}>
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Secure your account !</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              ref={emailInputRef}
              onEdited={setEmail}
              placeholder="Email"
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isEmail
              defaultValue={email}
            />
            <FormInput
              ref={passwordInputRef}
              onEdited={setPassword}
              placeholder="Password"
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              defaultValue={password}
            />
            <FormInput
              ref={passwordConfirmationInputRef}
              onEdited={setPasswordConfirmation}
              placeholder="Password confirmation"
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              defaultValue={passwordConfirmation}
            />
          </View>
          <LoadingGlassButton
            loading={loading}
            onPress={() => {
              const emailValid = emailInputRef.current?.isValid();
              const passwordValid = passwordInputRef.current?.isValid();
              const passwordConfirmationValid = passwordConfirmationInputRef.current?.isValid();
              const samePasswords = passwordInputRef.current?.getValue() === passwordConfirmationInputRef.current?.getValue();
              if (!samePasswords) {
                passwordInputRef.current?.setInvalid('Passwords does not match');
                passwordConfirmationInputRef.current?.setInvalid('Passwords does not match');
              }
              const isValid = emailValid && passwordValid && passwordConfirmationValid && samePasswords;
              isValid && viewSliderRef.current?.goToView(5);
              isValid && Keyboard.dismiss();
            }}
            disabled={email === '' || password === '' || passwordConfirmation === ''}
          />
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>We need you to Turn on geolocation</Text>
            <Text style={styles.subtitle}>{'Or you won\'t be able to use the app'}</Text>
          </View>
          <MaterialIcons name="location-pin" size={60} color={Colors.grey} />
          <LoadingGlassButton
            loading={loading}
            onPress={handleGeolocationPermissions}
            text="Turn on"
          />
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>{'Don\'t miss your personnal messages '}</Text>
            <Text style={styles.subtitle}>Turn on notifications</Text>
          </View>
          <MaterialCommunityIcons name="bell-ring" size={50} color={Colors.grey} />
          <LoadingGlassButton
            loading={loading}
            onPress={handleNotificationsPermissions}
            text="Turn on"
          />
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
          <LoadingGlassButton
            loading={loading}
            onPress={handleBackgroundGeolocationPermissions}
            text="Turn on"
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.emoji}>😃</Text>
          <Text style={{ ...Fonts.bold(30, Colors.darkGrey) }}>Almost there !</Text>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <FormCheckBox text={'I agree with dropy\'s {terms & conditions}'} onChanged={setTermsChecked} textUrl='https://dropy-app.com/privacy-policy.html'/>
            <FormCheckBox text={'subscribe to dropy\'s newsletter'} onChanged={setNewsletterChecked}/>
          </View>
          <LoadingGlassButton
            loading={loading}
            onPress={handleRegister}
            disabled={!termsChecked}
            text="Start"
          />
        </View>
      </ViewSlider>
    </SafeAreaView>
  );
}

const LoadingGlassButton = ({ loading, onPress, disabled, text }) => (
  <GlassButton
    onPress={onPress}
    style={text ? { ...styles.nextButton, paddingVertical: 15, width: 150 } : styles.nextButton}
    disabled={disabled}
  >
    {text ? (
      <Text style={{ ...Fonts.bold(15, Colors.white), opacity: loading ? 0 : 1 }}>{text}</Text>
    ) : (
      <AntDesign name="arrowright" size={32} color="white"/>
    )}

    {loading && (
      <View style={{ ...StyleSheet.absoluteFillObject, ...Styles.center }}>
        <LoadingSpinner size={20} color={Colors.white} />
      </View>
    )}
  </GlassButton>
);

const styles = StyleSheet.create({
  container: {
    // transform: [{ scale: 0.05 }],
    backgroundColor: Colors.white,
    flex: 1,
    ...Styles.center,
    justifyContent: 'space-between',
    ...Styles.safeAreaView,
  },
  view: {
    width: responsiveWidth(100),
    height: 400,
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
