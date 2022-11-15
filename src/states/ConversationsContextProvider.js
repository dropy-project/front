import { useNavigation } from '@react-navigation/native';
import React, { createContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { decryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';

export const ConversationsContext = createContext(null);

const ConversationsContextProvider = ({ children }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  const { chatSocket } = useSocket();

  useEffect(() => {
    if (chatSocket == null)
      return;

    listConversations();
    chatSocket.on('connect', listConversations);

    chatSocket.on('conversation_updated', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been updated correctly.', response.error);
        return;
      }

      createOrUpdateConversation(response.data);
    });

    chatSocket.on('close_conversation', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been closed correctly.', response.error);
        return;
      }

      const closedConversationId = response.data.id;
      setConversations((old) => old.filter((conversation) => conversation.id !== closedConversationId));
    });

    return () => {
      chatSocket.off('connect');
      chatSocket.off('conversation_updated');
      chatSocket.off('close_conversation');
    };
  }, [chatSocket]);

  const createOrUpdateConversation = (conversation) => {
    setConversations((old) => {
      const updatedConversation = {
        ...conversation,
        lastMessageDate: messageTimeString(conversation.lastMessageDate),
        lastMessagePreview: decryptMessage(conversation.lastMessagePreview),
      };

      const newConversations = [updatedConversation, ...old.filter((c) => c.id !== conversation.id)];

      const sortedConversations = newConversations.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

      return sortedConversations;
    });
  };

  const listConversations = () => {
    if (chatSocket == null)
      return;
    setLoading(true);
    chatSocket.emit('list_conversations', (response) => {
      if (response.error != null) {
        console.error('Error while getting conversations', response.error);
        return;
      }

      const sortedConversations = response.data.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

      const datedConversations = sortedConversations.map((c) => ({
        ...c,
        lastMessageDate: messageTimeString(c.lastMessageDate),
        lastMessagePreview: decryptMessage(c.lastMessagePreview),
      }));

      setConversations(datedConversations);
      setLoading(false);
    });
  };

  const closeConversation = (conversationId) => {
    setConversations((old) => old.filter((conversation) => conversation.id !== conversationId));
    return new Promise((resolve) => {
      chatSocket.emit('close_conversation', conversationId, resolve);
    });
  };

  const createConversation = (dropyId) => new Promise((resolve, reject) => {
    if (chatSocket == null)
      return resolve();
    chatSocket.emit('create_conversation', { dropyId }, (response) => {
      if (response.error != null)
        return reject(response.error);

      const conversation = response.data;
      createOrUpdateConversation(conversation);
      resolve(conversation);
    });
  });

  const markConversationAsRead = (conversationId) => {
    setConversations((old) => old.map((conversation) => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          unreadMessagesCount: 0,
        };
      }
      return conversation;
    }));
  };

  const openChat = (conversationId) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation == null)
      return;
    navigation.navigate('Chat', { conversation });
  };

  return (
    <ConversationsContext.Provider value={{
      loading,
      conversations,
      closeConversation,
      markConversationAsRead,
      listConversations,
      createConversation,
      openChat,
    }}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsContextProvider;
