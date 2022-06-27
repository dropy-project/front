import { useEffect } from 'react';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const Splash = ({ navigation }) => {

  const { setUser, user } = useCurrentUser();

  const autoLogin = async () => {
    try {
      const user = await API.login();
      setUser(user);
    } catch (error) {
      console.log(error.response);
      if (error.response?.status === 409)
        navigation.navigate('Register');
    }
  };

  useEffect(() => {
    if(user != null)
      navigation.navigate('Home');
  }, [user]);

  useEffect(() => {
    autoLogin();
  }, []);

  return null;
};

export default Splash;
