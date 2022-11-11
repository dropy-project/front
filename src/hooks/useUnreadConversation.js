import { useEffect, useState } from 'react';
import useConversationsSocket from './useConversationsSocket';

const useUnreadConversation = () => {
  const [unreadConversation, setUnreadConversation] = useState(false);

  const { conversations } = useConversationsSocket();

  useEffect(() => {
    if (conversations == null)
      return;

    const unreadConversation = conversations.some((conversation) => conversation.unreadMessagesCount > 0);
    setUnreadConversation(unreadConversation);
  }, [conversations]);

  return unreadConversation;
};

export default useUnreadConversation;
