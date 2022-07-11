import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import { messageTimeString } from '../utils/time';
import useCurrentUser from './useCurrentUser';

export const MESSAGES_PER_PAGE = 30;

const useChatSocket = (conversationId) => {

  const { user } = useCurrentUser();

  const [messages, setMessages] = useState([]);
  const [otherUserConnected, setOtherUserConnected] = useState(null);

  useEffect(() => {

    joinConversation();
    Socket.chatSocket.on('connect', joinConversation);

    Socket.chatSocket.on('message_sent', response => {
      if (response.error != null) {
        console.error('Error getting sent message', response.error);
        return;
      }
      setMessages(olds => [...olds, {
        ...response.data,
        date: messageTimeString(response.data.date),
      }]);
    });

    Socket.chatSocket.on('user_status', response => {
      console.log(response);
      if (response.error != null) {
        console.error('Error getting user status', response.error);
        return;
      }
      setOtherUserConnected(response.data);
    });

    return () => {
      Socket.chatSocket.emit('leave_conversation', conversationId);

      Socket.chatSocket.off('connect');
      Socket.chatSocket.off('message_sent');
      Socket.chatSocket.off('user_status');
    };
  }, []);

  const joinConversation = () => {
    Socket.chatSocket.emit('join_conversation', conversationId, response => {
      console.log(`Chat socket conversation joined ${conversationId} ${response.status}`);
    });

    Socket.chatSocket.emit('list_messages', { conversationId, offset: 0, limit: MESSAGES_PER_PAGE }, response => {
      if (response.error != null) {
        console.error('Error getting conversation messages', response.error);
        return;
      }

      setMessages(response.data.map(message => ({
        ...message,
        date: messageTimeString(message.date),
      })));
    });
  };

  const sendMessage = content => {
    Socket.chatSocket.emit('message_sent', { content, conversationId }, response => {
      if (response.error != null) {
        console.error('Error getting messages', response.error);
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

  const loadMoreMessages = () => {
    Socket.chatSocket.emit('list_messages', { conversationId, offset: Math.round(messages.length / MESSAGES_PER_PAGE), limit: MESSAGES_PER_PAGE }, response => {
      if (response.error != null) {
        console.error('Error getting conversation messages', response.error);
        return;
      }
      setMessages(olds => [...response.data.map(message => ({
        ...message,
        date: messageTimeString(message.date),
      })), ...olds]);
    });
  };

  return { otherUserConnected, sendMessage, messages, loadMoreMessages };
};

export default useChatSocket;
