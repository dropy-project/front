import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Notifications } from 'react-native-notifications';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import { extractNotificationPayload } from '../states/NotificationProvider';
import Styles, { Colors, Fonts } from '../styles/Styles';

const Splash = ({ navigation }) => {

  const { setUser, user } = useCurrentUser();
  const [error, setError] = useState(null);

  const login = async () => {
    setError(null);
    try {
      const user = await API.login();
      setUser(user);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('No user found linked to this device UID');
        navigation.reset({ index: 0, routes: [{ name: 'Register' }] });
        return;
      }

      console.error('Login error', error?.response?.data || error);
      setError(error?.response?.data || error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    if (user != null) handleLoginSuccess();
  }, [user]);

  const handleLoginSuccess = async () => {
    const initialNotification = await Notifications.getInitialNotification();

    const payload = extractNotificationPayload(initialNotification);

    if (payload?.user?.displayName != null) {
      console.log('Login success with notification payload', payload);
      navigation.reset({
        index: 2,
        routes: [
          { name: 'Home' },
          { name: 'Conversations' },
          { name: 'Chat', params: { conversation: payload } }
        ],
      });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...Fonts.regular(15, Colors.darkGrey) }}>
        {user == null ? `Login process${error ? ' failed' : ''}` : `${user.username} | Loading app ...`}
      </Text>
      {error != null && (
        <>
          <Text style={{ ...Fonts.ligth(10, Colors.darkGrey), marginTop: 20 }}>
            {`${error}`}
          </Text>
          <TouchableOpacity onPress={login} style={{ marginTop: 30 }}>
            <Text style={{ ...Fonts.regular(15, Colors.red) }}>
          [Retry]
            </Text>
          </TouchableOpacity>
        </>
      )}
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
