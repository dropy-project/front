import React, { createContext, useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet, Platform } from 'react-native';

import { Manager } from 'socket.io-client';

import useCurrentUser from '../hooks/useCurrentUser';
import useEffectForegroundOnly from '../hooks/useEffectForegroundOnly';

import ReconnectingOverlay from '../components/overlays/ReconnectingOverlay';

const log = (...params) => {
  console.log('\x1b[33m[ Sockets Context Provider ]\x1b[0m', ...params);
};

import AppInfo from '../../app.json';
import API from '../services/API';

const DOMAIN_PREFIX = AppInfo.productionMode ? '' : 'preprod-';
const SOCKET_BASE_URL = AppInfo.customSocket ?? `https://${DOMAIN_PREFIX}socket.dropy-app.com`;

export const SocketContext = createContext(null);

const SocketContextProvider = ({ children }) => {

  const { user } = useCurrentUser();

  const manager = useRef(null);
  const dropySocket = useRef(null);
  const chatSocket = useRef(null);

  const [initialized, setInitialized] = useState(false);

  const [dropySocketConnected, setDropySocketConnected] = useState(false);
  const [chatSocketConnected, setChatSocketConnected] = useState(false);

  const isTemporaryDisconnected = useRef(false);

  const allSocketsConnected = dropySocketConnected && chatSocketConnected;

  useEffectForegroundOnly(() => {
    if(user == null) return;
    if(initialized === true) return;

    manager.current = new Manager(SOCKET_BASE_URL, {
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
    dropySocket.current.on('disconnect', () => {
      setDropySocketConnected(false);
    });
    chatSocket.current.on('disconnect', () => {
      setChatSocketConnected(false);
    });

    log('Sockets initilized');
    setInitialized(true);

    return () => {
      dropySocket.current?.off('connect');
      chatSocket.current?.off('connect');
      dropySocket.current?.off('disconnect');
      chatSocket.current?.off('disconnect');

      dropySocket.current?.disconnect();
      chatSocket.current?.disconnect();
      log('Sockets destroyed');
    };
  }, [user]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (isTemporaryDisconnected.current) {
          reconnectSocketsFromTemporaryDisconnection();
        }
      } else if (nextAppState === (Platform.OS === 'ios' ? 'background' : 'inactive')) {
        if (chatSocket.current?.connected || dropySocket.current?.connected) {
          temporaryDisconnectSockets();
        }
      }
    });
    return appStateListener.remove;
  }, []);

  const reconnectSocketsFromTemporaryDisconnection = () => {
    log('Reconnecting sockets from temporary disconnection');
    dropySocket?.current.connect();
    chatSocket?.current.connect();
    isTemporaryDisconnected.current = false;
  };

  const temporaryDisconnectSockets = () => {
    log('Temporary disconnecting sockets');
    dropySocket?.current.disconnect();
    chatSocket?.current.disconnect();
    isTemporaryDisconnected.current = true;
  };

  return(
    <View style={StyleSheet.absoluteFillObject}>
      <SocketContext.Provider value={{
        dropySocket: dropySocket.current,
        chatSocket: chatSocket.current,
        connected: allSocketsConnected,
      }}>
        {children}
      </SocketContext.Provider>
      <ReconnectingOverlay visible={!allSocketsConnected && user != null} />
    </View>
  );
};

export default SocketContextProvider;
