import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../services/API';
import Socket from '../services/socket';
import useCurrentUser from './useCurrentUser';

const log = (...params) => {
  console.log('\x1b[32m[ Chat Socket ]\x1b[0m', ...params);
};

const useChatSocket = conversationId => {
  const socketRef = useRef();

  const { user } = useCurrentUser();

  const [messages, setMessages] = useState([]);
  const [otherUserConnected, setOtherUserConnected] = useState(null);

  useEffect(() => {
    socketRef.current = io(Socket.chatSocketUrl(), {
      transports: ['websocket'],
      extraHeaders: {
        ...API.getHeaders(),
      },
    });

    socketRef.current.on('connect', () => {
      log('Dropies around socket connected');

      socketRef.current.emit('join_conversation', conversationId, response => {
        if (response.error != null) {
          log('Error getting messages', response.error);
          return;
        }
        console.log(response);
        setMessages(response.data ?? []);
      });

      socketRef.current.emit('user_status', true);
    });

    socketRef.current.on('message_sent', response => {
      if (response.error != null) {
        log('Error getting sent message', response.error);
        return;
      }
      console.log(response);
      setMessages(olds => [...olds, response.data]);
    });

    socketRef.current.on('connect_error', err => {
      log(`connect_error due to ${err.message}`);
    });

    socketRef.current.on('user_status', response => {
      console.log(response);
      if (response.error != null) {
        log('Error getting user status', response.error);
        return;
      }
      setOtherUserConnected(response.data);
    });

    socketRef.current.on('request_status', () => {
      socketRef.current.emit('user_status', true);
    });

    return () => {
      socketRef.current.emit('user_status', false);
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = content => {
    socketRef.current.emit(
      'message_sent',
      { content, conversationId },
      response => {
        if (response.error != null) {
          log('Error getting messages', response.error);
          return;
        }
        setMessages(olds => [
          ...olds,
          {
            id: response.data,
            content,
            read: false,
            date: new Date(),
            sender: {
              displayName: user.displayName,
              id: user.id,
            },
          }
        ]);
      }
    );
  };

  return { otherUserConnected, sendMessage, messages };
};

export default useChatSocket;
