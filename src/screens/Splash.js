import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

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
