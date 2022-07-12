import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import { decryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';

const useConversationSocket = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {

    Socket.chatSocket.on('conversation_updated', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been update correctly.', response.error);
        return;
      }

      setConversations(old => {
        return [
          ...old.filter(conversation => conversation.id !== response.data.id),
          {
            ...response.data,
            lastMessageDate: messageTimeString(response.data.lastMessageDate),
            lastMessagePreview: response.data.lastMessagePreview == null ?
              `Start chatting with ${response.data.user.displayName}` :
              decryptMessage(response.data.lastMessagePreview),
          }
        ];
      });
    });

    Socket.chatSocket.emit('list_conversations', (response) => {
      console.log('Chat socket conversations listed');
      if (response.error != null) {
        console.error('The list of the conversations can not be send.', response.error);
        return;
      }

      setConversations(response.data.map(c => {
        return {
          ...c,
          lastMessageDate: messageTimeString(c.lastMessageDate),
          lastMessagePreview: c.lastMessagePreview == null ? undefined : decryptMessage(c.lastMessagePreview),
        };
      }));
    });

    return () => {
      Socket.chatSocket.off('conversation_updated');
    };
  }, []);

  return { conversations };
};

export default useConversationSocket;
