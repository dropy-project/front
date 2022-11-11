import { useContext } from 'react';
import { SocketContext } from '../states/SocketContextProvider';

const useSocket = () => useContext(SocketContext);

export default useSocket;
