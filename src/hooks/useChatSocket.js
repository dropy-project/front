import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../states/SocketContextProvider';
import { messageTimeString } from '../utils/time';
import useCurrentUser from './useCurrentUser';

const log = (...params) => {
  console.log('\x1b[32m[ Chat Socket ]\x1b[0m', ...params);
};

const useChatSocket = (conversationId) => {

  const { user } = useCurrentUser();

  const [messages, setMessages] = useState([]);
  const [otherUserConnected, setOtherUserConnected] = useState(null);

  const { chatSocket } = useContext(SocketContext);

  useEffect(() => {

    chatSocket.emit('join_conversation', conversationId, response => {
      log(`Chat socket conversation joined ${conversationId}`);
      if (response.error != null) {
        log('Error getting messages', response.error);
        return;
      }
      setMessages(response.data.map(message => ({
        ...message,
        date: messageTimeString(message.date),
      })));
    });

    chatSocket.on('message_sent', response => {
      if (response.error != null) {
        log('Error getting sent message', response.error);
        return;
      }
      console.log(response);
      setMessages(olds => [...olds, {
        ...response.data,
        date: messageTimeString(response.data.date),
      }]);
    });

    chatSocket.on('user_status', response => {
      console.log(response);
      if (response.error != null) {
        log('Error getting user status', response.error);
        return;
      }
      setOtherUserConnected(response.data);
    });

    return () => {
      chatSocket.off('message_sent');
      chatSocket.off('user_status');
    };
  }, []);

  const sendMessage = content => {
    chatSocket.emit(
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
            date: messageTimeString(new Date()),
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
