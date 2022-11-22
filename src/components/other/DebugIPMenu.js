import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { Keyboard, Text, View } from 'react-native';
import useCurrentUser from '../../hooks/useCurrentUser';
import useOverlay from '../../hooks/useOverlay';
import API from '../../services/API';
import { Colors } from '../../styles/Styles';
import Storage from '../../utils/storage';
import FormInput from '../input/FormInput';
import GlassButton from '../input/GlassButton';

const DebugIPMenu = () => {
  const navigation = useNavigation();
  const { sendAlert } = useOverlay();
  const { customUrls, setCustomUrls } = useCurrentUser();

  const apiInputRef = useRef();
  const socketInputRef = useRef();

  const resetConn = async () => {
    await API.logout();
    navigation.reset({ index: 0,
      routes: [
        {
          name: 'Splash',
          params: { cancelAutoLogin: true } }
      ] });
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
    resetConn();
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
    resetConn();
  };

  return (
    <View style={{
      width: '80%',
      alignItems: 'center',
      borderColor: Colors.red,
      borderWidth: 1,
      paddingBottom: 20,
      marginTop: 10,
    }}>
      {customUrls ? (
        <>
          <Text>API : {customUrls.api}</Text>
          <Text>Socket : {customUrls.socket}</Text>
          <GlassButton
            onPress={clearIp}
            style={{ padding: 10, marginTop: 15, width: '80%' }}
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
            style={{ padding: 10, marginTop: 15, width: '80%' }}
            fontSize={10}
            buttonText='Apply' />
        </>
      )}
    </View>

  );
};

export default DebugIPMenu;
