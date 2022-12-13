import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';
import useOverlay from '../hooks/useOverlay';
import MEDIA_TYPES from '../utils/mediaTypes';
import GoBackHeader from '../components/other/GoBackHeader';
import GlassButton from '../components/input/GlassButton';

const CreateDropyTextScreen = ({ navigation, route }) => {
  const { sendAlert } = useOverlay();

  const { dropyData = '' } = route.params || {};
  const [text, setText] = useState(dropyData);

  const handleTextSubmit = async () => {
    Keyboard.dismiss();

    if (text.length < 20) {
      sendAlert({
        title: 'Tu n\'a que ça à dire ?',
        description: 'Soit courageux et donne nous plus d\'infos !',
        validateText: 'Je peux faire mieux !',
      });
      return;
    }

    if (text.length < 100) {
      const result = await sendAlert({
        title: 'Court mais efficace ?',
        description: 'Penses-tu que ton message est assez long pour être compris ?',
        denyText: 'Envoyer quand même',
        validateText: 'Je peux faire mieux !',
      });
      if (result)
        return;
    }

    navigation.navigate('Home', {
      dropyCreateParams: {
        dropyFilePath: null,
        dropyData: text,
        mediaType: MEDIA_TYPES.TEXT,
        originRoute: 'CreateDropyText',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={ () => navigation.navigate('Home')} text={'Ouvre ton coeur !'}/>
      <MaterialCommunityIcons name='draw-pen' size={80} color={Colors.mainBlue} style={{ ...Styles.blueShadow, ...styles.penIcon }}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <TextInput placeholder='Que voudrais-tu dire au monde ?'
            multiline={true}
            placeholderTextColor={Colors.lightGrey}
            style={styles.textInput}
            blurOnSubmit
            autoFocus
            onChangeText={(text) => setText(text)}
            value={text}
          />
        </TouchableWithoutFeedback>
        <GlassButton
          fontSize={13}
          style={styles.largeButton}
          buttonText={'Confirmer'}
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  penIcon: {
    marginTop: '20%',
    marginBottom: 20,
  },

});
