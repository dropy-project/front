import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Notifications } from 'react-native-notifications';
import { Platform } from 'react-native';

import API from '../services/API';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import Notification from '../components/Notification';
import useConversationsSocket from '../hooks/useConversationsSocket';

export const extractNotificationPayload = (notification) => {
  if(Platform.OS === 'android') {
    const payload = notification?.payload['gcm.notification.click_action'];
    if(payload == null) return null;
    return JSON.parse(payload);
  } else {
    const payload = notification?.payload?.aps?.category;
    if(payload == null) return null;
    return JSON.parse(payload);
  }
};

const NotificationProvider = ({ children }) => {

  const { user } = useCurrentUser();
  const navigation = useNavigation();

  const [initialized, setInitialized] = useState(false);
  const [pendingConversationToOpen, setPendingConversationToOpen] = useState(null);

  const [notificationData, setNotificationData] = useState(null);

  const {
    conversations,
  } = useConversationsSocket();

  useEffectForegroundOnly(() => {
    if(user == null) return;
    setupNotifications();
    sendDeviceToken();
  }, [user]);

  const setupNotifications = () => {
    if(initialized) return;
    setInitialized(true);

    console.log('Setu notifications');
    Notifications.registerRemoteNotifications();

    const registrationFailedEvent = Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error('Notification registation error', event);
    });

    const receivedForegroundEvent = Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({ alert: false, sound: false, badge: false });

      const payload = extractNotificationPayload(notification);
      if(payload == null) return;

      setNotificationData({
        title: notification.title,
        body: notification.body ?? notification?.payload?.message,
        onPress: () => openConversation(payload),
      });
    });

    const openedEvent = Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('App openened from notification');
      completion();

      const payload = extractNotificationPayload(notification);
      if(payload == null) return;

      setPendingConversationToOpen(payload);
    });

    Notifications.ios.setBadgeCount(0);

    return () => {
      registrationFailedEvent.remove();
      receivedForegroundEvent.remove();
      openedEvent.remove();
    };
  };

  useEffectForegroundOnly(() => {
    if(conversations == null) return;
    if(pendingConversationToOpen != null) {
      openConversation(pendingConversationToOpen);
      setPendingConversationToOpen(null);
    }
  }, [pendingConversationToOpen, conversations]);

  const openConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
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
