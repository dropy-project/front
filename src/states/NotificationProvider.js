import { useEffect } from 'react';
import { Notifications } from 'react-native-notifications';

const NotificationProvider = ({ children }) => {

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = () => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken);
    });

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

  return children;
};

export default NotificationProvider;
