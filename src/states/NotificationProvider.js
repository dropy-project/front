import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const NotificationProvider = ({ children }) => {

  const { user } = useCurrentUser();

  useEffect(() => {
    if(user != null)
      setupNotifications();
  }, [user]);

  const setupNotifications = () => {
    Notifications.registerRemoteNotifications();

    sendDeviceToken();

    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event);
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({ alert: false, sound: false, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
  };

  const sendDeviceToken = async () => {
    try {
      const registerEvent = await Notifications.events().registerRemoteNotificationsRegistered();
      const deviceTokenResponse = await API.postUserToken(user.id, registerEvent.deviceToken);
      console.log('Register device token response', deviceTokenResponse);
    } catch (error) {
      console.error('Send device token error', error);
    }
  };

  return children;
};

export default NotificationProvider;
