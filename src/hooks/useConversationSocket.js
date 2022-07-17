import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import { decryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';

const useConversationSocket = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if(Socket.chatSocket == null) return;

    listConversations();
    Socket.chatSocket.on('connect', listConversations);

    Socket.chatSocket.on('conversation_updated', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been updated correctly.', response.error);
        return;
      }

      setConversations(old => {
        const newConversation = {
          ...response.data,
          lastMessageDate: messageTimeString(response.data.lastMessageDate),
          lastMessagePreview: decryptMessage(response.data.lastMessagePreview),
        };

        return [
          newConversation,
          ...old.filter(conversation => conversation.id !== response.data.id)
        ];
      });
    });

    Socket.chatSocket.on('close_conversation', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been closed correctly.', response.error);
        return;
      }

      const closedConversationId = response.data.id;
      setConversations(old => old.filter(conversation => conversation.id !== closedConversationId));
    });

    return () => {
      Socket.chatSocket.off('connect');
      Socket.chatSocket.off('conversation_updated');
      Socket.chatSocket.off('close_conversation');
    };
  }, []);

  const listConversations = () => {
    Socket.chatSocket.emit('list_conversations', (response) => {
      if(Socket.chatSocket == null) return;
      if(Socket.chatSocket.connected === false) return;

      if (response.error != null) {
        console.error('Error while getting conversations', response.error);
        return;
      }

      const sortedConversations = response.data.sort((a, b) => {
        return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
      });

      const datedConversations = sortedConversations.map(c => {
        return {
          ...c,
          lastMessageDate: messageTimeString(c.lastMessageDate),
          lastMessagePreview: decryptMessage(c.lastMessagePreview),
        };
      });

      setConversations(datedConversations);
    });
  };

  const closeConversation = (conversationId) => {

    setConversations(old => old.filter(conversation => conversation.id !== conversationId));

    return new Promise((resolve) => {
      Socket.chatSocket.emit('close_conversation', conversationId, resolve);
    });
  };

  return { conversations, closeConversation };
};

export default useConversationSocket;
