import { useContext } from 'react';
import { SocketContext } from '../states/SocketContextProvider';

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
