import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import Socket from '../services/socket';
import useCurrentUser from '../hooks/useCurrentUser';

const log = (...params) => {
  console.log('\x1b[33m[ Sockets Provider ]\x1b[0m', ...params);
};

const SocketProvider = ({ children }) => {

  const { user } = useCurrentUser();

  const isTemporaryDisconnected = useRef(false);

  useEffect(() => {
    if(user == null) return;

    if(AppState.currentState === 'background') {
      console.log('Socket initilization skipped (App is in background)');
      return;
    }

    Socket.initSockets();

    handleUserStatus();

    log('Sockets initilized');

    return () => {
      Socket.chatSocket?.emit('user_status', false);

      Socket.destroySockets();
      log('Sockets destroyed');
    };
  }, [user]);

  const handleUserStatus = () => {
    if(Socket.chatSocket == null) return;

    Socket.chatSocket.emit('user_status', true);

    Socket.chatSocket.on('request_status', () => {
      Socket.chatSocket.emit('user_status', true);
    });
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (isTemporaryDisconnected.current) {
          reconnectSocketsFromTemporaryDisconnection();
        }
      } else if (nextAppState.match(/background|inactive/)) {
        if (Socket.chatSocket.connected || Socket.dropySocket.connected) {
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

  return children;
};

export default SocketProvider;
