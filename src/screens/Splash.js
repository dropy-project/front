import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';
import useOverlay from '../hooks/useOverlay';

import API from '../services/API';

import { extractNotificationPayload } from '../states/NotificationProvider';
import Storage from '../utils/storage';

const Splash = ({ navigation }) => {

  const { setUser, user } = useCurrentUser();

  const { sendAlert } = useOverlay();

  useEffectForegroundOnly(() => {
    launch();
  }, []);

  const launch = async () => {
    const isCompatibleWithServer = await API.serverVersionIsCompatible();
    if(!isCompatibleWithServer) {
      sendAlert({
        title: 'Server version is not compatible',
        description: 'Please update the app to the latest version',
      });
      return;
    }

    const userTokenData = await Storage.getItem('@auth_tokens');
    if (userTokenData == null) {
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
      return;
    }

    try {
      if (userTokenData.expires < Date.now()) {
        await API.refreshToken(userTokenData.refreshToken);
        const response = await API.getUserProfile();
        const user = response.data;
        setUser(user);
      } else {
        const response = await API.getUserProfile();
        const user = response.data;
        setUser(user);
      }
    } catch (error) {
      console.error('Auto login error', error?.response?.data || error);
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    }
  };

  useEffect(() => {
    if (user != null) handleLoginSuccess();
  }, [user]);

  const handleLoginSuccess = async () => {
    const initialNotification = await Notifications.getInitialNotification();

    const payload = extractNotificationPayload(initialNotification);

    if (payload?.user?.displayName != null) {
      console.log('Login success with notification payload', payload);
      navigation.reset({
        index: 2,
        routes: [
          { name: 'Home' },
          { name: 'Conversations' },
          { name: 'Chat', params: { conversation: payload } }
        ],
      });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  return null;
};

export default Splash;
