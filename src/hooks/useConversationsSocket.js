import { useContext } from 'react';
import { ConversationsContext } from '../states/ConversationsContextProvider';

const useConversationsSocket = () => useContext(ConversationsContext);

export default useConversationsSocket;
