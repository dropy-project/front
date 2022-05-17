

import { useEffect } from 'react';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const Splash = ({ navigation }) => {

  const { setUser } = useCurrentUser();

  const autoLogin = async () => {
    try {
      await API.login();
      const user = await API.getUser();
      setUser(user);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
      if (error.response?.status === 409)
        navigation.navigate('Register');
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return null;
};

export default Splash;
