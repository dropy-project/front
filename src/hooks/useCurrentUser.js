import { useContext } from 'react';
import { UserContext } from '../states/UserContextProvider';

const useCurrentUser = () => useContext(UserContext);

export default useCurrentUser;
