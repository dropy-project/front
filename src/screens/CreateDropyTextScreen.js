import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from '../components/GoBackHeader';
import GlassButton from '../components/GlassButton';
import MEDIA_TYPES from '../utils/mediaTypes';
import useOverlay from '../hooks/useOverlay';

const CreateDropyTextScreen = ({ navigation, route }) => {

  const { sendAlert } = useOverlay();

  const { dropyData = '' } = route.params || {};
  const [text, setText] = useState(dropyData);

  const handleTextSubmit = async () => {
    Keyboard.dismiss();

    if(text.length < 20) {
      sendAlert({
        title: 'That\'s it?',
        description: 'Hey this is a bit short !\nBe a hero and add more details to your drop !',
        validateText: 'OK',
      });
      return;
    }

    if(text.length < 100) {
      const result = await sendAlert({
        title: 'Short but efficient!',
        description: 'Nothing more to say ?\nThink of who\'s gonna see this drop!',
        denyText: 'Send anyway!',
        validateText: 'I can do longer!',
      });
      if(result) return;
    }

    const params = {
      dropyFilePath: null,
      dropyData: text,
      mediaType: MEDIA_TYPES.TEXT,
      originRoute: 'CreateDropyText',
    };
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { dropyCreateParams: params } }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={ () => navigation.navigate('Home')} text={'Tips: open your heart !'}/>
      <MaterialCommunityIcons name="draw-pen" size={80} color={Colors.mainBlue} style={{ ...Styles.blueShadow, ...styles.penIcon }}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      ><TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <TextInput placeholder="What do you want to tell anybody ? "
            multiline={true}
            placeholderTextColor={Colors.lightGrey}
            style={styles.textInput}
            blurOnSubmit
            autoFocus
            onChangeText={(text) => setText(text)}
            value={text}/>
        </TouchableWithoutFeedback>
        <GlassButton
          style={styles.largeButton}
          buttonText={'start'}
          onPress={handleTextSubmit}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateDropyTextScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  inputContainer: {
    height: '60%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    padding: 10,
    fontSize: 15,
    ...Fonts.bold(12, Colors.grey),
    paddingTop: 20,
    backgroundColor: Colors.lighterGrey,
    width: 300,
    borderRadius: 14,
    height: 150,
  },
  largeButton: {
    width: 228,
    height: 57,
    marginBottom: 20,
  },
  penIcon: {
    marginTop: '20%',
    marginBottom: 20,
  },

});
