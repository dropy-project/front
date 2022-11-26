import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';
import useOverlay from '../hooks/useOverlay';

import API from '../services/API';

import { extractNotificationPayload } from '../states/NotificationProvider';
import Storage from '../utils/storage';

const Splash = ({ navigation, route }) => {
  const { cancelAutoLogin = false } = route.params ?? {};

  const { setUser, user, customUrls } = useCurrentUser();

  const { sendAlert } = useOverlay();

  useEffectForegroundOnly(() => {
    launch();
  }, []);

  useEffect(() => {
    if (user != null && !cancelAutoLogin)
      handleLoginSuccess();
  }, [user]);

  const navigateToOnboarding = () => {
    Storage.removeItem('@auth_tokens');
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  const launch = async () => {
    const ready = await appIsReady();
    console.log(`Splash launch : app is ready -> ${ready}`);

    if (!ready) {
      if (customUrls != null)
        navigateToOnboarding();
      return;
    }

    if (cancelAutoLogin) {
      console.log('Splash launch : auto login cancelled');
      setUser(null);
      navigateToOnboarding();
      return;
    }

    try {
      const userInfos = await autoLogin();
      if (userInfos == null) {
        console.log('Splash launch : auto login failed');
        navigateToOnboarding();
      } else {
        console.log('Splash launch : auto login success');
        setUser(userInfos);
      }
    } catch (error) {
      console.error('Auto login error', error?.response?.data || error);
      navigateToOnboarding();
    }
  };

  const appIsReady = async () => {
    try {
      await API.init();
      const isCompatibleWithServer = await API.serverVersionIsCompatible();

      if (!isCompatibleWithServer) {
        sendAlert({
          title: 'Server version is not compatible',
          description: 'Please update the app to the latest version',
        });
      }
      return isCompatibleWithServer;
    } catch (error) {
      sendAlert({
        title: 'We could not connect to the server',
        description: 'Please check your internet connection and try again.',
      });
    }
    return false;
  };

  const autoLogin = async () => {
    const userTokenData = await Storage.getItem('@auth_tokens');
    if (userTokenData == null)
      return null;


    if (userTokenData.expires < Date.now())
      await API.refreshToken(userTokenData.refreshToken);


    const response = await API.getUserProfile();
    return response.data;
  };

  const handleLoginSuccess = async () => {
    const initialNotification = await Notifications.getInitialNotification();

    const payload = extractNotificationPayload(initialNotification);

    if (payload?.user?.displayName != null) {
      console.log('Login success with notification payload', payload);
      navigation.reset({
        index: 2,
        routes: [{ name: 'Home' }, { name: 'Conversations' }, { name: 'Chat', params: { conversation: payload } }],
      });
    } else
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return null;
};

export default Splash;
