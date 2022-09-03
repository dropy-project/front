import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useState } from 'react';
import { decryptMessage, encryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';
import useCurrentUser from './useCurrentUser';
import useSocket from './useSocket';

export const MESSAGES_PER_PAGE = 30;

const useChatSocket = (conversationId, onError = () => {}, onAllMessageLoadEnd = () => {}, onNewMessage = () => {}) => {

  const navigation = useNavigation();
  const { user } = useCurrentUser();

  const { chatSocket } = useSocket();

  const [messageBuffer, setMessagesBuffer] = useState({
    messages: [],
    action: null,
    loading: true,
  });

  const [otherUserConnected, setOtherUserConnected] = useState(null);

  useLayoutEffect(() => {
    if (messageBuffer.action != null) {
      messageBuffer.action();
    }
  }, [messageBuffer]);

  useEffect(() => {

    joinConversation();
    chatSocket.on('connect', joinConversation);

    chatSocket.on('message_sent', response => {
      if (response.error != null) {
        onError(response.error);
        console.error('Error getting sent message', response.error);
        return;
      }

      const newMessage = {
        ...response.data,
        content: typeof response.data.content === 'string' ?
          decryptMessage(response.data.content) :
          response.data.content,
      };

      setMessagesBuffer(oldBuffer => {
        return {
          messages: [newMessage, ...oldBuffer.messages],
          action: onNewMessage,
          loading: false,
        };
      });
    });

    chatSocket.on('user_status', response => {
      if (response.error != null) {
        console.error('Error getting user status', response.error);
        return;
      }
      setOtherUserConnected(response.data);
    });

    chatSocket.on('join_conversation', response => {
      if (response.error != null) {
        console.error('Error getting other user conversation joined', response.error);
        return;
      }

      setMessagesBuffer((old) => {
        const messages = [...old.messages];
        messages[0].read = true;

        return {
          messages,
          action: null,
          loading: false,
        };
      });
    });

    chatSocket.on('close_conversation', (response) => {
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
      chatSocket.emit('leave_conversation', conversationId, (response) => {
        if(response.error != null)
          console.error('Error leaving conversation', response.error);
      });

      chatSocket.off('connect');
      chatSocket.off('message_sent');
      chatSocket.off('user_status');
      chatSocket.off('close_conversation');
    };
  }, []);

  const joinConversation = () => {
    setMessagesBuffer(oldBuffer => ({
      ...oldBuffer,
      loading: true,
    }));

    chatSocket.emit('join_conversation', conversationId, response => {
      if (response.error != null) {
        onError(response.error);
        console.error('Error joining conversation', response.error);
        return;
      }
      console.log(`Chat socket conversation joined ${conversationId} ${response.status}`);
    });

    chatSocket.emit('list_messages', { conversationId, offset: 0, limit: MESSAGES_PER_PAGE }, response => {
      if (response.error != null) {
        onError(response.error);
        console.error('Error getting conversation messages', response.error);
        return;
      }

      const messages = response.data.map(message => ({
        ...message,
        content: typeof message.content === 'string' ?
          decryptMessage(message.content) :
          message.content,
      }));

      setMessagesBuffer(() => {
        return {
          messages: messages.reverse(),
          action: onAllMessageLoadEnd,
          loading: false,
        };
      });
    });
  };

  const sendMessage = content => {
    chatSocket.emit('message_sent', { content: encryptMessage(content), conversationId }, response => {
      if (response.error != null) {
        console.error('Error getting messages', response.error);
        return;
      }

      const { messageRead, messageId } = response.data;

      const newMessage = {
        id: messageId,
        content,
        read: messageRead,
        date: new Date(),
        sender: {
          displayName: user.displayName,
          id: user.id,
        },
      };

      setMessagesBuffer(oldBuffer => {
        return {
          messages: [newMessage, ...oldBuffer.messages],
          action: onNewMessage,
          loading: false,
        };
      }
      );
    });
  };

  const loadMoreMessages = () => {
    chatSocket.emit('list_messages', {
      conversationId,
      offset: Math.round(messageBuffer.messages.length / MESSAGES_PER_PAGE),
      limit: MESSAGES_PER_PAGE,
    }, response => {
      if (response.error != null) {
        console.error('Error getting conversation messages', response.error);
        return;
      }

      if(messageBuffer.messages.some(message => response.data.some(newMessage => newMessage.id === message.id))) {
        console.log('End of chat reached');
        return;
      }

      const newMessages = response.data.map(message => ({
        ...message,
        content: typeof message.content === 'string' ?
          decryptMessage(message.content) :
          message.content,
        date: messageTimeString(message.date),
      }));

      setMessagesBuffer(oldBuffer => {
        const messages = [
          ...oldBuffer.messages,
          ...newMessages.reverse()
        ];

        return {
          messages,
          action: null,
          loading: false,
        };
      });
    });
  };

  return {
    messages: messageBuffer?.messages ?? [],
    loading: messageBuffer.loading,
    otherUserConnected,
    sendMessage,
    loadMoreMessages,
  };
};


export default useChatSocket;
