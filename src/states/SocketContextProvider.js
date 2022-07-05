import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import Socket from '../services/socket';
import API from '../services/API';
import useCurrentUser from '../hooks/useCurrentUser';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {

  const [dropySocket, setDropySocket] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);

  const { user } = useCurrentUser();

  useEffect(() => {
    if(user == null) return;

    console.log('SocketProvider : Sockets initilized');

    setDropySocket(io(Socket.dropySocketUrl(), {
      transports: ['websocket'],
      extraHeaders: {
        ...API.getHeaders(),
      },
    }));

    setChatSocket(io(Socket.chatSocketUrl(), {
      transports: ['websocket'],
      extraHeaders: {
        ...API.getHeaders(),
      },
    }));

    return () => {
      dropySocket.disconnect();
      chatSocket.disconnect();

      chatSocket.emit('user_status', false);

      setDropySocket(null);
      setChatSocket(null);
      console.log('SocketProvider : Sockets destroyed');
    };
  }, [user]);

  useEffect(() => {
    if(chatSocket == null) return;

    chatSocket.on('connect_error', err => {
      console.error(`Chat socket connect_error due to ${err.message}`);
    });

    chatSocket.emit('user_status', true);

    chatSocket.on('request_status', () => {
      chatSocket.emit('user_status', true);
    });

  }, [chatSocket]);

  useEffect(() => {
    if(dropySocket == null) return;

    dropySocket.on('connect_error', (err) => {
      console.error(`Dropy socket connect_error due to ${err.message}`);
    });
  }, [dropySocket]);

  return (
    <SocketContext.Provider value={{
      dropySocket,
      chatSocket,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
