import { useNavigation } from '@react-navigation/native';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import useSocket from '../hooks/useSocket';
import { decryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';

export const ConversationsContext = createContext(null);

const ConversationsContextProvider = ({ children }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [openIdOnLoad, setOpenIdOnLoad] = useState(null);

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

      const conversation = response.data;
      createOrUpdateConversation(conversation);
    });

    return () => {
      chatSocket.off('connect');
      chatSocket.off('conversation_updated');
      chatSocket.off('close_conversation');
    };
  }, [chatSocket, createOrUpdateConversation, listConversations]);

  const createOrUpdateConversation = useCallback((conversation) => {
    const updatedConversation = {
      ...conversation,
      lastMessageDate: messageTimeString(conversation.lastMessageDate),
      lastMessagePreview: decryptMessage(conversation.lastMessagePreview),
    };

    setConversations((old) => {
      const newConversations = [updatedConversation, ...old.filter((c) => c.id !== conversation.id)];

      const sortedConversations = newConversations.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

      return sortedConversations;
    });
  }, []);

  const listConversations = useCallback(() => {
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
  }, [chatSocket]);

  useEffect(() => {
    if (openIdOnLoad !== null && conversations.length > 0) {
      openChat(openIdOnLoad);
      setOpenIdOnLoad(null);
    }
  }, [openChat, openIdOnLoad, conversations]);

  const closeConversation = useCallback((conversationId) => {
    setConversations((old) => old.filter((conversation) => conversation.id !== conversationId));
    return new Promise((resolve) => {
      chatSocket.emit('close_conversation', conversationId, resolve);
    });
  }, [chatSocket]);

  const createConversation = useCallback((dropyId) => new Promise((resolve, reject) => {
    if (chatSocket == null)
      return resolve();
    chatSocket.emit('create_conversation', { dropyId }, (response) => {
      if (response.error != null)
        return reject(response.error);

      const conversation = response.data;
      createOrUpdateConversation(conversation);
      resolve(conversation);
    });
  }), [chatSocket, createOrUpdateConversation]);

  const markConversationAsRead = useCallback((conversationId) => {
    setConversations((old) => old.map((conversation) => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          unreadMessagesCount: 0,
        };
      }
      return conversation;
    }));
  }, []);

  const openChat = useCallback((conversationId) => {
    if (conversations == null || conversations.length === 0) {
      console.log(`Conversations are not loaded yet, ${conversationId} will be opened on load end`);
      setOpenIdOnLoad(conversationId);
      return;
    }

    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation == null)
      return;

    navigation.navigate('Chat', { conversation });
    markConversationAsRead(conversationId);
  }, [conversations, markConversationAsRead, navigation]);

  const conversationIsOpen = useCallback((conversationId) => conversations.find((c) => c.id === conversationId) != null, [conversations]);

  const value = useMemo(() => ({
    loading,
    conversations,
    closeConversation,
    markConversationAsRead,
    listConversations,
    createConversation,
    openChat,
    conversationIsOpen,
  }), [
    loading,
    conversations,
    closeConversation,
    markConversationAsRead,
    listConversations,
    createConversation,
    openChat,
    conversationIsOpen
  ]);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};

export default ConversationsContextProvider;
