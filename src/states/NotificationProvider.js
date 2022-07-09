import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Notifications } from 'react-native-notifications';
import Notification from '../components/Notification';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const NotificationProvider = ({ children }) => {

  const { user } = useCurrentUser();
  const navigation = useNavigation();

  const [initialized, setInitialized] = useState(false);

  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    if(user != null)
      setupNotifications();
  }, [user]);

  const setupNotifications = () => {
    if(initialized) return;
    setInitialized(true);

    Notifications.registerRemoteNotifications();

    sendDeviceToken();

    const registrationFailedEvent = Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event);
    });

    const receivedForegroundEvent = Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({ alert: false, sound: false, badge: false });

      const conversation = JSON.parse(notification.payload.category);
      console.log(conversation);

      if(conversation == null)
        return;


      setNotificationData({
        title: notification.title,
        body: notification.body,
        onPress: () => openConversation(conversation),
      });
    });

    const openedEvent = Notifications.events().registerNotificationOpened((notification, completion) => {
      completion();

      if(notification == null) return;

      const conversation = JSON.parse(notification.payload.category);
      console.log('App openened from notification');

      if(conversation != null)
        openConversation(conversation);
    });

    return () => {
      registrationFailedEvent.remove();
      receivedForegroundEvent.remove();
      openedEvent.remove();
    };
  };

  const openConversation = (conversation) => {
    navigation.reset({
      index: 2,
      routes: [
        { name: 'Home' },
        { name: 'Conversations' },
        { name: 'Chat', params: { conversation } }
      ],
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

  return (
    <>
      {children}
      <Notification data={notificationData} onDone={() => setNotificationData(null)} />
    </>
  );
};

export default NotificationProvider;
