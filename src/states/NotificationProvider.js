import { useEffect, useState } from 'react';
import { Notifications } from 'react-native-notifications';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const NotificationProvider = ({ children }) => {

  const { user } = useCurrentUser();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(user != null)
      setupNotifications();
  }, [user]);

  const setupNotifications = () => {
    if(initialized) return;
    setInitialized(true);

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
    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log('Device token:', event.deviceToken);
      API.postUserDeviceToken(event.deviceToken).then((response) => {
        console.log('Device token sent to server:', response.data);
      }).catch((error) => {
        console.error('Send device token error', error);
      });
    });
  };

  return children;
};

export default NotificationProvider;
