import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const Splash = ({ navigation }) => {

  const { setUser, user } = useCurrentUser();

  const [isInitialised, setIsInitialised] = useState(false);

  const autoLogin = async () => {
    try {
      const user = await API.login();
      setUser(user);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('No user found linked to this device UID');
        navigation.navigate('Register');
      } else {
        console.error(error?.response?.data || error);
      }
    }
  };

  useEffect(() => {
    if(user != null && isInitialised === false) {
      navigation.navigate('Home');
      setIsInitialised(true);
    }
  }, [user]);

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ ...Fonts.regular(15, Colors.darkGrey) }}>Loading ...</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Styles.center,
  },
});
