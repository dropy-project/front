import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, StyleSheet } from 'react-native';

import Socket from '../services/socket';
import useCurrentUser from '../hooks/useCurrentUser';
import ReconnectingOverlay from '../components/overlays/ReconnectingOverlay';

const log = (...params) => {
  console.log('\x1b[33m[ Sockets Provider ]\x1b[0m', ...params);
};

const SocketProvider = ({ children }) => {

  const { user } = useCurrentUser();

  const [connected, setConnected] = useState(false);
  const isTemporaryDisconnected = useRef(false);

  useEffect(() => {
    if(user == null) return;

    Socket.initSockets();

    Socket.dropySocket.on('connect', () => {
      setConnected(true);
    });

    Socket.dropySocket.on('disconnect', () => {
      setConnected(false);
    });
    Socket.chatSocket.on('disconnect', () => {
      setConnected(false);
    });

    Socket.manager.on('connect_error', err => {
      setConnected(false);
      console.error(`Socket connect_error due to ${err.message}`);
    });

    log('Sockets initilized');

    return () => {
      Socket.destroySockets();
      log('Sockets destroyed');
    };
  }, [user]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (isTemporaryDisconnected.current) {
          reconnectSocketsFromTemporaryDisconnection();
        }
      } else if (nextAppState === 'background') {
        if (Socket.chatSocket?.connected || Socket.dropySocket?.connected) {
          temporaryDisconnectSockets();
        }
      }
    });
    return appStateListener.remove;
  }, []);

  const reconnectSocketsFromTemporaryDisconnection = () => {
    log('Reconnecting sockets from temporary disconnection');
    Socket.dropySocket?.connect();
    Socket.chatSocket?.connect();
    isTemporaryDisconnected.current = false;
  };

  const temporaryDisconnectSockets = () => {
    log('Temporary disconnecting sockets');
    Socket.dropySocket?.disconnect();
    Socket.chatSocket?.disconnect();
    isTemporaryDisconnected.current = true;
  };

  return(
    <View style={StyleSheet.absoluteFillObject}>
      {children}
      <ReconnectingOverlay visible={!connected} />
    </View>
  );
};

export default SocketProvider;
