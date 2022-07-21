import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import { decryptMessage, encryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';
import useCurrentUser from './useCurrentUser';

export const MESSAGES_PER_PAGE = 30;

const useChatSocket = (conversationId) => {

  const navigation = useNavigation();
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
        content: typeof response.data.content === 'string' ?
          decryptMessage(response.data.content) :
          response.data.content,
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

    Socket.chatSocket.on('close_conversation', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been closed correctly.', response.error);
        return;
      }

      const closedConversationId = response.data.id;
      if(closedConversationId === conversationId) {
        navigation.goBack();
        console.log('Conversation forced closed as the other user has closed it');
      }
    });

    return () => {
      Socket.chatSocket.emit('leave_conversation', conversationId, (response) => {
        if(response.error != null)
          console.error('Error leaving conversation', response.error);
      });

      Socket.chatSocket.off('connect');
      Socket.chatSocket.off('message_sent');
      Socket.chatSocket.off('user_status');
      Socket.chatSocket.off('close_conversation');
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
        content: typeof message.content === 'string' ?
          decryptMessage(message.content) :
          message.content,
      })));
    });
  };

  const sendMessage = content => {
    Socket.chatSocket.emit('message_sent', { content: encryptMessage(content), conversationId }, response => {
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
