import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Manager } from 'socket.io-client';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import ReconnectingOverlay from '../components/overlays/ReconnectingOverlay';

const log = (...params) => {
  console.log('\x1b[33m[ Sockets ]\x1b[0m', ...params);
};

import AppInfo from '../../app.json';
import API from '../services/API';
import Storage from '../utils/storage';
import DoubleConnectionOverlay from '../components/overlays/DoubleConnectionOverlay';
import useOnAppFocused from '../hooks/useOnAppFocused';

const DOMAIN_PREFIX = AppInfo.productionMode ? '' : 'preprod-';
const SOCKET_BASE_URL = `https://${DOMAIN_PREFIX}socket.dropy-app.com`;

export const SocketContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const { user } = useCurrentUser();

  const manager = useRef(null);
  const dropySocket = useRef(null);
  const chatSocket = useRef(null);

  const [initialized, setInitialized] = useState(false);
  const [doubleConnectionLocked, setDoubleConnectionLocked] = useState(false);

  const [dropySocketConnected, setDropySocketConnected] = useState(false);
  const [chatSocketConnected, setChatSocketConnected] = useState(false);

  const allSocketsConnected = dropySocketConnected && chatSocketConnected;

  useEffectForegroundOnly(() => {
    const initilizeSockets = async () => {
      if (user == null) {
        destroyAllSocket();
        return;
      }
      if (initialized === true)
        return;

      const customUrls = await Storage.getItem('@custom_urls');
      manager.current = new Manager(customUrls?.socket ?? SOCKET_BASE_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        extraHeaders: API.getHeaders(),
      });

      dropySocket.current = manager.current.socket('/dropy');
      chatSocket.current = manager.current.socket('/chat');

      dropySocket.current.on('connect', () => {
        setDropySocketConnected(true);
      });
      chatSocket.current.on('connect', () => {
        setChatSocketConnected(true);
      });

      dropySocket.current.on('connect_error', (err) => {
        setDropySocketConnected(false);
        console.error('Dropy socket connection error', err);
      });
      chatSocket.current.on('connect_error', (err) => {
        setChatSocketConnected(false);
        console.error('Chat socket connection error', err);
      });

      dropySocket.current.on('disconnect', () => {
        setDropySocketConnected(false);
      });
      chatSocket.current.on('disconnect', () => {
        setChatSocketConnected(false);
      });

      // Waiting for https://github.com/dropy-project/back/issues/206
      // to be fixed
      // chatSocket.current.on('double_connection', async () => {
      //   log('Double connection detected by host, destroying all sockets');
      //   destroyAllSocket();
      //   setDoubleConnectionLocked(true);
      // });

      log('Sockets initilized');
      setInitialized(true);
    };

    initilizeSockets();
  }, [user]);

  useEffect(() => () => {
    dropySocket.current?.off('connect');
    chatSocket.current?.off('connect');
    dropySocket.current?.off('disconnect');
    chatSocket.current?.off('disconnect');
    dropySocket.current?.off('connect_error');
    chatSocket.current?.off('connect_error');

    dropySocket.current?.disconnect();
    chatSocket.current?.disconnect();
    log('Sockets shutdown');
  }, []);

  const destroyAllSocket = () => {
    if (!initialized)
      return;
    dropySocket.current?.disconnect();
    chatSocket.current?.disconnect();
    manager.current = null;
    setInitialized(false);
    setChatSocketConnected(false);
    setDropySocketConnected(false);
    log('Sockets destroyed');
  };

  useOnAppFocused(() => {
    if (initialized === false)
      return;
    if (dropySocket.current?.connected === false) {
      setDropySocketConnected(false);
      setTimeout(() => {
        dropySocket.current?.disconnect();
        log('Reconnecting dropy socket');
        dropySocket.current.connect({ forceNew: true });
      }, 1000);
    }
    if (chatSocket.current?.connected === false) {
      setChatSocketConnected(false);
      setTimeout(() => {
        chatSocket.current?.disconnect();
        log('Reconnecting chat socket');
        chatSocket.current.connect({ forceNew: true });
      }, 1000);
    }
    if (dropySocket.current?.connected && chatSocket.current?.connected) {
      setDropySocketConnected(true);
      setChatSocketConnected(true);
      log('Sockets are connected');
    }
  });

  const value = useMemo(() => ({
    dropySocket: dropySocket.current,
    chatSocket: chatSocket.current,
    connected: allSocketsConnected,
  }), [allSocketsConnected]);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <SocketContext.Provider value={value}>
        {children}
      </SocketContext.Provider>
      <ReconnectingOverlay visible={!allSocketsConnected && user != null} />
      {doubleConnectionLocked && <DoubleConnectionOverlay />}
    </View>
  );
};

export default SocketContextProvider;
