import React, { useRef, useState } from 'react';
import { Notifications } from 'react-native-notifications';
import { Platform } from 'react-native';

import API from '../services/API';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import useConversationsSocket from '../hooks/useConversationsSocket';

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

  const tokenSent = useRef(false);

  const [notificationsStack, setNotificationsStack] = useState(null);

  const { openChat } = useConversationsSocket();

  useEffectForegroundOnly(() => {
    if (user == null) {
      tokenSent.current = false;
      return;
    }
    if (tokenSent.current)
      return;
    tokenSent.current = true;

    const remoteNotificationEvent = Notifications.events().registerRemoteNotificationsRegistered((event) => {
      console.log('Device token:', event.deviceToken);
      API.postUserDeviceToken(event.deviceToken).then((response) => {
        console.log('Device token sent to server:', response.data);
      }).catch((error) => {
        console.error('Send device token error', error);
      });
    });

    return () => {
      remoteNotificationEvent.remove();
    };
  }, [user]);

  useEffectForegroundOnly(() => {
    if (user == null)
      return;

    Notifications.ios.setBadgeCount(0);
    Notifications.registerRemoteNotifications();

    const registrationFailedEvent = Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error('Notification registration error', event);
    });

    return () => {
      registrationFailedEvent.remove();
    };
  }, [user]);

  useEffectForegroundOnly(() => {
    if (user == null)
      return;

    const receivedForegroundEvent = Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification received in foreground', notification);
      completion({ alert: false, sound: true, badge: false });

      const payload = extractNotificationPayload(notification);

      const notifData = {
        title: notification.title,
        body: notification.body ?? notification?.payload?.message,
        id: new Date().getTime(),
        onPress: isNaN(payload) ? () => {} : () => openChat(payload),
      };

      setNotificationsStack((old) => {
        const newStack = [...(old ?? []), notifData];
        return newStack;
      });
    });

    return () => {
      receivedForegroundEvent.remove();
    };
  }, [user]);

  useEffectForegroundOnly(() => {
    if (user == null)
      return;

    const openedEvent = Notifications.events().registerNotificationOpened((notification, completion) => {
      completion();
      Notifications.ios.setBadgeCount(0);

      const payload = extractNotificationPayload(notification);
      if (payload == null)
        return;

      openChat(payload);
    });

    return () => {
      openedEvent.remove();
    };
  }, [openChat, user]);

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
