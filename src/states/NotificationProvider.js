import React, { useState } from 'react';
import { Notifications } from 'react-native-notifications';
import { Platform } from 'react-native';

import API from '../services/API';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import useConversationsSocket from '../hooks/useConversationsSocket';

import Haptics from '../utils/haptics';

import Notification from '../components/overlays/Notification';

export const extractNotificationPayload = (notification) => {
  if (Platform.OS === 'android') {
    const payload = notification?.payload['gcm.notification.click_action'];
    if (payload == null)
      return null;
    return JSON.parse(payload);
  }
  const payload = notification?.payload?.aps?.category;
  if (payload == null)
    return null;
  return JSON.parse(payload);
};

const NotificationProvider = ({ children }) => {
  const { user } = useCurrentUser();

  const [initialized, setInitialized] = useState(false);
  const [pendingConversationToOpen, setPendingConversationToOpen] = useState(null);

  const [notificationsStack, setNotificationsStack] = useState(null);

  const { openChat } = useConversationsSocket();

  useEffectForegroundOnly(() => {
    if (user == null)
      return;
    if (initialized)
      return;
    setInitialized(true);
    setupNotifications();
    sendDeviceToken();
  }, [user]);

  const setupNotifications = () => {
    Notifications.registerRemoteNotifications();

    const registrationFailedEvent = Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error('Notification registation error', event);
    });

    const receivedForegroundEvent = Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification received in foreground', notification);
      completion({ alert: false, sound: false, badge: false });

      const payload = extractNotificationPayload(notification);
      if (payload == null)
        return;

      const notifData = {
        title: notification.title,
        body: notification.body ?? notification?.payload?.message,
        id: new Date().getTime(),
        onPress: () => openChat(payload),
      };

      setNotificationsStack((old) => {
        const newStack = [...(old ?? []), notifData];
        Haptics.impactLight();
        return newStack;
      });
    });

    const openedEvent = Notifications.events().registerNotificationOpened((notification, completion) => {
      completion();

      const payload = extractNotificationPayload(notification);
      if (payload == null)
        return;

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
    if (pendingConversationToOpen != null) {
      openChat(pendingConversationToOpen);
      setPendingConversationToOpen(null);
    }
  }, [pendingConversationToOpen]);

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

  const handleNotificationDone = () => {
    setNotificationsStack((old) => {
      const newStack = [...old];
      newStack.shift();
      return newStack;
    });
  };

  return (
    <>
      {children}
      {notificationsStack?.map((notifData) => (
        <Notification
          key={notifData.id}
          data={notifData}
          onDone={handleNotificationDone} />
      ))}
    </>
  );
};

export default NotificationProvider;
