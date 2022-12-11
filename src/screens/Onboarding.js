import {
  Animated,
  Easing,
  Image,
  Keyboard,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { AntDesign, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { openCamera, openPicker } from 'react-native-image-crop-picker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { PERMISSIONS, request, requestNotifications, RESULTS } from 'react-native-permissions';
import Config from 'react-native-config';
import DropyLogo from '../assets/svgs/dropy_logo_grey.svg';
import Styles, { Colors, Fonts } from '../styles/Styles';
import OnboardingLines from '../assets/svgs/onboarding_lines.svg';
import { compressImage } from '../utils/files';
import API from '../services/API';
import useOverlay from '../hooks/useOverlay';
import useCurrentUser from '../hooks/useCurrentUser';

import { BackgroundGeolocationContext } from '../states/BackgroundGolocationContextProvider';

import GoBackHeader from '../components/other/GoBackHeader';
import FormInput from '../components/input/FormInput';
import ViewSlider from '../components/viewSlider/ViewSlider';
import FormCheckBox from '../components/input/FormCheckBox';
import GlassButton from '../components/input/GlassButton';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import DebugUrlsMenu from '../components/other/DebugUrlsMenu';
import { missingCameraPersmissionAlert, missingLibraryPermissionAlert } from '../utils/mediaPermissionsAlerts';

const DEBUG = __DEV__;
const devUsername = Config.DEV_ACCOUNT_USERNAME ?? '';
const devEmail = Config.DEV_ACCOUNT_EMAIL ?? '';
const devPassword = Config.DEV_ACCOUNT_PASSWORD ?? '';


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
  const { user, setUser, customUrls } = useCurrentUser();

  const [loading, setLoading] = useState(false);

  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [displayName, setDisplayName] = useState(DEBUG ? devUsername : '');
  const [profilePicturePath, setProfilePicturePath] = useState(null);
  const [email, setEmail] = useState(DEBUG ? devEmail : '');
  const [password, setPassword] = useState(DEBUG ? devPassword : '');
  const [passwordConfirmation, setPasswordConfirmation] = useState(DEBUG ? devPassword : '');

  const [termsChecked, setTermsChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    const anim = Animated.timing(translateWavesAnimatedValue, {
      toValue: currentViewIndex * -responsiveWidth(100),
      duration: 600,
      useNativeDriver: true,
      easing: Easing.bezier(.44, .23, .06, 1.04),
    });
    anim.start();
    return () => anim.stop();
  }, [currentViewIndex]);

  useEffect(() => {
    const anim = Animated.timing(dropyLogoAnimatedValue, {
      toValue: currentViewIndex === 1 ? 1 : 0,
      duration: currentViewIndex === 1 ? 600 : 200,
      useNativeDriver: true,
      easing: currentViewIndex === 1 ? Easing.elastic(1.5) : Easing.bezier(.43, -0.59, .4, .64),
    });
    anim.start();
    return () => anim.stop();
  }, [currentViewIndex]);

  const onPressEditPicture = () => {
    const options = profilePicturePath == null ? {
      options: ['Prendre une photo', 'Choisir depuis la gallerie', 'Annuler'],
      cancelButtonIndex: 2,
      title: 'Comment veux-tu créer ta photo de profil ?',
    } : {
      options: ['Prendre une photo', 'Choisir depuis la gallerie', 'Supprimer', 'Annuler'],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
      title: 'Comment veux-tu créer ta photo de profil ?',
    };

    showActionSheetWithOptions(options, (buttonIndex) => {
      if (buttonIndex === 0)
        setProfilePictureFromCamera();
      else if (buttonIndex === 1)
        setProfilePictureFromLibrary();
      else if (buttonIndex === 2)
        setProfilePicturePath(null);
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
      if (error.code === 'E_NO_LIBRARY_PERMISSION')
        missingLibraryPermissionAlert(sendAlert);
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
      if (error.code === 'E_NO_CAMERA_PERMISSION')
        missingCameraPersmissionAlert(sendAlert);
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
      } else
        setUser(userInfos);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409) {
        const validated = await sendAlert({
          title: 'Cet email est déjà utilisé...',
          description: 'Si tu as déjà un compte, connecte-toi !',
          validateText: 'Se connecter',
          denyText: 'Ok',
        });
        validated && viewSliderRef.current?.goToView(0);
        return;
      }
      sendAlert({
        title: 'Oups, une erreur est survenue...',
        description: 'Vérifie ta connexion internet et réessaye.',
        validateText: 'Ok',
      });
      console.error(error.response.data);
    }
  };

  const handleLogin = async () => {
    const emailValid = loginEmailInputRef.current?.isValid();

    if (!emailValid) {
      console.log('email not valid');
      return;
    }

    await requestGeolocationPermissions();
    await requestNotificationsPermissions();

    try {
      setLoading(true);
      const userInfos = await API.login(email, password);
      // Fix #322 permissions granting messing with states -> sockets not initializing
      setTimeout(() => {
        setUser(userInfos);
      }, 1000);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        sendAlert({
          title: 'Ce compte n\'existe pas',
          description: 'Vérifie ton email',
          validateText: 'Ok',
        });
        return;
      }
      if (error.response.status === 403) {
        sendAlert({
          title: 'Flute, mauvais mot de passe',
          description: 'Vérifie ton mot de passe',
          validateText: 'Ok',
        });
        return;
      }
      sendAlert({
        title: 'Sacrebleu, une erreur est survenue...',
        description: 'Vérifie ta connexion internet et réessaye.',
        validateText: 'Ok',
      });
      console.error(error.response.data);
      console.error(error.response.status);
    }
  };

  useEffect(() => {
    if (user == null)
      return;
    console.log('Onboarding done sucessfully', user);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }, [user]);

  const requestGeolocationPermissions = async (onSuccess = () => {}) => {
    let result = null;
    setLoading(true);

    if (Platform.OS === 'ios')
      result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    else
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);


    switch (result) {
      case RESULTS.UNAVAILABLE:
        await sendAlert({
          title: 'Il y a un problème...',
          description: 'Ton téléphone ne supporte pas la géolocalisation',
        });
        break;
      case RESULTS.DENIED:
        geolocationNotGrantedAlert();
        break;
      case RESULTS.BLOCKED:
        geolocationNotGrantedAlert();
        break;
      case RESULTS.GRANTED:
        onSuccess();
        break;
      default:
        break;
    }
    setLoading(false);
  };

  const requestNotificationsPermissions = async (onSuccess = () => {}, onFailed = () => {}) => {
    setLoading(true);
    const result = await requestNotifications(['alert', 'sound', 'badge', 'criticalAlert']);

    switch (result.status) {
      case RESULTS.DENIED:
      case RESULTS.BLOCKED:
        onFailed();
        break;
      case RESULTS.GRANTED:
        onSuccess();
        break;
      default:
        break;
    }

    setLoading(false);
  };

  const requestBackgroundGeolocationPermissions = async (onSuccess = () => {}) => {
    setLoading(true);
    try {
      setBackgroundGeolocationEnabled(true);
    } catch (error) {
      console.error(error);
    } finally {
      onSuccess();
      setLoading(false);
    }
  };

  const geolocationNotGrantedAlert = async () => {
    const alertResult = await sendAlert({
      title: `Fichtre, tu dois autoriser la géolocalisation !`,
      description: 'Sinon l\'application ne fonctionnera pas correctement...',
      validateText: 'Ouvrir les paramètres',
    });
    alertResult && Linking.openSettings();
  };

  return (
    <SafeAreaView style={styles.container}>

      {currentViewIndex === 0 && (
        <GoBackHeader inverted onPressGoBack={() => {
          Keyboard?.dismiss();
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
        transform: [{ translateX: Animated.add(translateWavesAnimatedValue, -responsiveWidth(20)) }],
      }}>
        <OnboardingLines preserveAspectRatio='xMinXMin slice' width={'120%'} height={'120%'} />
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
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Bon retour !</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              ref={loginEmailInputRef}
              placeholder='Ton email'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              onEdited={setEmail}
              isEmail
              defaultValue={email}
              autoComplete='email'
            />
            <FormInput
              placeholder='Ton mot de passe ultra secret'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              onEdited={setPassword}
              defaultValue={password}
              autoComplete='password'
            />
          </View>
          <LoadingGlassButton
            onPress={handleLogin}
            disabled={email.length === 0 || password.length === 0}
            text='Connexion'
            loading={loading}
          />
        </View>

        <View style={styles.view}>
          <Text style={{ fontSize: 40 }}>👋</Text>
          <View style={{ ...Styles.center }}>
            <Text style={{ ...styles.title, fontSize: 35 }}>Salut !</Text>
            <Text style={{ ...styles.subtitle, fontSize: 20 }}>Prêt·e à droper ?</Text>
          </View>
          <LoadingGlassButton
            onPress={() => viewSliderRef.current?.goToView(2)}
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.title}>{'Commençons tranquillement !'}</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              placeholder="Comment t'appelles-tu ?"
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
            <Text style={styles.title}>Montre ton jolie sourire !</Text>
            <Text style={styles.subtitle}>Choisis une photo de profil</Text>
          </View>
          <TouchableOpacity onPress={onPressEditPicture} style={{ ...Styles.center, width: 100, height: 100, borderRadius: 30, backgroundColor: Colors.purple3, overflow: 'hidden' }}>
            {profilePicturePath ? (
              <Image source={{ uri: profilePicturePath }} style={{ ...StyleSheet.absoluteFillObject }}/>
            ) : (
              <MaterialCommunityIcons name='image-plus' size={40} color='white' />
            )}
          </TouchableOpacity>
          <LoadingGlassButton
            loading={loading}
            onPress={() => viewSliderRef.current?.goToView(4)}
            disabled={profilePicturePath == null}
          />
        </View>

        <View style={{ ...styles.view }}>
          <Text style={{ ...Fonts.bold(20, Colors.darkGrey) }}>Sécurisons ton compte !</Text>
          <View style={{ width: '80%' }}>
            <FormInput
              ref={emailInputRef}
              onEdited={setEmail}
              placeholder='Ton email'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isEmail
              defaultValue={email}
              autoComplete='email'
            />
            <FormInput
              ref={passwordInputRef}
              onEdited={setPassword}
              placeholder='Ton mot de passe ultra sécurisé'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              defaultValue={password}
              autoComplete='password-new'
            />
            <FormInput
              ref={passwordConfirmationInputRef}
              onEdited={setPasswordConfirmation}
              placeholder='Confirme ton mot de passe'
              inputStyle={{ backgroundColor: Colors.lighterGrey }}
              isPassword
              defaultValue={passwordConfirmation}
              autoComplete='password-new'
            />
          </View>
          <LoadingGlassButton
            loading={loading}
            onPress={() => {
              const emailValid = emailInputRef.current?.isValid();
              const passwordValid = passwordInputRef.current?.isValid();
              const passwordConfirmationValid = passwordConfirmationInputRef.current?.isValid();
              const inputsValid = emailValid && passwordValid && passwordConfirmationValid;
              const samePasswords = passwordInputRef.current?.getValue() === passwordConfirmationInputRef.current?.getValue();
              if (inputsValid && !samePasswords) {
                passwordInputRef.current?.setInvalid('Le mot de passe en dessous n\'est pas identique');
                passwordConfirmationInputRef.current?.setInvalid('Le mot de passe au dessus ment');
              }
              const everythingValid = inputsValid && samePasswords;
              everythingValid && viewSliderRef.current?.goToView(5);
              everythingValid && Keyboard.dismiss();
            }}
            disabled={email === '' || password === '' || passwordConfirmation === ''}
          />
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>Active la géolocalisation</Text>
            <Text style={styles.subtitle}>{'Sinon tu ne pourras pas utiliser l\'app'}</Text>
          </View>
          <MaterialIcons name='location-pin' size={60} color={Colors.grey} />
          <LoadingGlassButton
            loading={loading}
            onPress={() => requestGeolocationPermissions(() => viewSliderRef.current?.goToView(6))}
            text='Activer'
          />
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>{'Ne rate aucun message'}</Text>
            <Text style={styles.subtitle}>Active les notifications</Text>
          </View>
          <MaterialCommunityIcons name='bell-ring' size={50} color={Colors.grey} />
          <LoadingGlassButton
            loading={loading}
            onPress={() => requestNotificationsPermissions(
              () => viewSliderRef.current?.goToView(7),
              () => viewSliderRef.current?.goToView(8)
            )}
            text='Activer'
          />
        </View>

        <View style={styles.view}>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <Text style={styles.title}>{'Reste à l\'affut !'}</Text>
            <Text style={styles.subtitle}>
              {'Active le mode radar pour être prévenu·e quand tu marches sur un drop !'}
            </Text>
            <Text style={{ ...styles.subtitle, ...Fonts.regular(10.5, Colors.grey), marginVertical: 3 }}>
              {'Ce mode utilise la géolocalisation en arrière plan,\nmais tkt on n\'est pas la pour t\'espionner.'}
            </Text>
            <TouchableOpacity>
              <Text style={{ ...Fonts.regular(13, '#44a0eb'), marginTop: 5, textDecorationLine: 'underline' }}>en savoir plus</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons name='radar' size={50} color={Colors.grey} />
          <LoadingGlassButton
            loading={loading}
            onPress={() => requestBackgroundGeolocationPermissions(
              () => viewSliderRef.current?.goToView(8)
            )}
            text='Activer'
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.emoji}>😃</Text>
          <Text style={{ ...Fonts.bold(30, Colors.darkGrey) }}>Tu y es presque !</Text>
          <View style={{ marginBottom: 30, ...Styles.center }}>
            <FormCheckBox text={'Accepter les {termes et conditions} de Dropy'} onChanged={setTermsChecked} textUrl='https://dropy-app.com/privacy-policy.html'/>
            <FormCheckBox text={'S\'abonner à la newsletter de Dropy'} onChanged={setNewsletterChecked}/>
          </View>
          <LoadingGlassButton
            loading={loading}
            onPress={handleRegister}
            disabled={!termsChecked}
            text="C'est parti !"
          />
        </View>
      </ViewSlider>
      {customUrls && <DebugUrlsMenu />}
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
      <AntDesign name='arrowright' size={32} color='white'/>
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
    maxWidth: responsiveWidth(80),
  },
  subtitle: {
    ...Fonts.bold(13, Colors.darkGrey),
    marginTop: 10,
    textAlign: 'center',
    maxWidth: responsiveWidth(85),
  },
});
