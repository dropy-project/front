import { useContext } from 'react';
import { UserContext } from '../states/UserContextProvider';

const useCurrentUser = () => {
  return useContext(UserContext);
};

export default useCurrentUser;
