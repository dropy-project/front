import { useEffect } from 'react';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';

const Splash = ({ navigation }) => {

  const { setUser } = useCurrentUser();

  const autoLogin = async () => {
    try {
      const user = await API.login();
      navigation.navigate('Home');
      setUser(user);
    } catch (error) {
      console.log(error.response);
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
