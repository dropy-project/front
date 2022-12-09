import { useContext } from 'react';
import { DropiesAroundContext } from '../states/DropiesAroundContextProvider';

const useDropiesAroundSocket = () => useContext(DropiesAroundContext);

export default useDropiesAroundSocket;
