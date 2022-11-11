import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';
import Svg1 from '../assets/svgs/background_auth_1.svg';
import Svg2 from '../assets/svgs/background_auth_2.svg';
import Svg3 from '../assets/svgs/background_auth_3.svg';
import API from '../services/API';
import useCurrentUser from '../hooks/useCurrentUser';

const RegisterScreen = ({ navigation }) => {
  const [name, setNameValue] = useState('');

  const { setUser } = useCurrentUser();

  const register = async () => {
    if (name.length === 0)
      return;
    try {
      const userInfos = await API.register(name);
      await API.login();
      setUser(userInfos);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Svg2 height={500} width={'110%'} style={{ ...styles.svg }} />
        <Svg1 height={400} width={'60%'} style={{ ...styles.svg }} />
        <Svg3 height={400} width={'110%'} style={{ ...styles.svg }} />
      </View>
      <SafeAreaView style={styles.content} >
        <Text style={{ ...Fonts.bold(50, Colors.white) }}>Dropy</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoidingView}
          keyboardVerticalOffset={responsiveHeight(20)}
        >
          <TextInput
            onChangeText={(text) => setNameValue(text)}
            style={{ ...Fonts.bold(15, Colors.grey), ...styles.textInput }}
            placeholder="What's your name ?"
            placeholderTextColor={Colors.lightGrey}
            returnKeyType='go'
            onEndEditing={register}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textInput: {
    width: 267,
    borderRadius: 14,
    padding: 15,
    backgroundColor: Colors.lighterGrey,
  },
  svg: {
    position: 'absolute',
  },
  avoidingView: {
    width: '100%',
    ...Styles.center,
  },
});
