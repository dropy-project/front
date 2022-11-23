import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import useCurrentUser from '../../hooks/useCurrentUser';
import useOverlay from '../../hooks/useOverlay';
import API from '../../services/API';
import { Colors } from '../../styles/Styles';
import Storage from '../../utils/storage';
import FormInput from '../input/FormInput';
import GlassButton from '../input/GlassButton';

const DebugUrlsMenu = () => {
  const navigation = useNavigation();
  const { sendAlert } = useOverlay();
  const { customUrls, setCustomUrls } = useCurrentUser();

  const apiInputRef = useRef();
  const socketInputRef = useRef();

  const resetConnection = async () => {
    await API.logout();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Splash',
          params: { cancelAutoLogin: true },
        }
      ],
    });
  };

  const saveIp = async () => {
    const apiUrl = apiInputRef.current.getValue();
    const socketUrl = socketInputRef.current.getValue();

    if (apiUrl.trim() === '' || socketUrl.trim() === '') {
      sendAlert({
        title: 'Error',
        description: 'Please fill both fields',
      });
      return;
    }

    Keyboard.dismiss();

    const result = await sendAlert({
      title: 'Confirmation',
      description: `${apiUrl}\n${socketUrl}`,
      validateText: 'Reload the app',
    });

    if (!result)
      return;

    await Storage.setItem('@custom_urls', { api: apiUrl, socket: socketUrl });
    setCustomUrls({ api: apiUrl, socket: socketUrl });
    resetConnection();
  };

  const clearIp = async () => {
    const result = await sendAlert({
      title: 'Confirmation',
      description: `Go back to default IPs?`,
      validateText: 'Reload the app',
    });

    if (!result)
      return;
    await Storage.removeItem('@custom_urls');
    setCustomUrls(null);
    resetConnection();
  };

  return (
    <View style={styles.container}>
      {customUrls ? (
        <>
          <Text>API : {customUrls.api}</Text>
          <Text>Socket : {customUrls.socket}</Text>
          <GlassButton
            onPress={clearIp}
            style={styles.button}
            fontSize={10}
            buttonText='Clear' />
        </>
      ) : (
        <>
          <FormInput
            ref={apiInputRef}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='API url'
          />
          <FormInput
            ref={socketInputRef}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Socket url'
          />
          <GlassButton
            onPress={saveIp}
            style={styles.button}
            fontSize={10}
            buttonText='Apply' />
        </>
      )}
    </View>

  );
};

export default DebugUrlsMenu;

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    borderColor: Colors.red,
    borderWidth: 1,
    paddingBottom: 20,
    marginTop: 10,
  },
  button: {
    padding: 10,
    marginTop: 15,
    width: '80%',
  },
});
