import { useEffect, useState } from 'react';
import Socket from '../services/socket';
import { decryptMessage } from '../utils/encrypt';
import { messageTimeString } from '../utils/time';

const useConversationSocket = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if(Socket.chatSocket == null) return;

    Socket.chatSocket.on('conversation_updated', (response) => {
      if (response.error != null) {
        console.error('Conversation has not been update correctly.', response.error);
        return;
      }

      setConversations(old => {
        return [
          {
            ...response.data,
            lastMessageDate: messageTimeString(response.data.lastMessageDate),
            lastMessagePreview: response.data.lastMessagePreview == null ?
              `Start chatting with ${response.data.user.displayName}` :
              decryptMessage(response.data.lastMessagePreview),
          },
          ...old.filter(conversation => conversation.id !== response.data.id)
        ];
      });
    });

    Socket.chatSocket.emit('list_conversations', (response) => {
      if(Socket.chatSocket == null) return;
      if(Socket.chatSocket.connected === false) return;
      console.log('Chat socket conversations listed');
      if (response.error != null) {
        console.error('The list of the conversations can not be send.', response.error);
        return;
      }

      setConversations(response.data.sort((a, b) => {
        return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
      }).map(c => {
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
