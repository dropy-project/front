import { useContext } from 'react';
import { ConversationsContext } from '../states/ConversationsContextProvider';

const useConversationsSocket = () => {
  return useContext(ConversationsContext);
};

export default useConversationsSocket;
