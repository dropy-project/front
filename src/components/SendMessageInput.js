import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Styles, { Colors, Fonts } from '../styles/Styles';

const SendMessageInput = ({ sendMessage, onFocus }) => {
  const [textInputContent, setTextInputContent] = useState('');

  const onSubmit = () => {
    // eslint-disable-next-line no-unused-expressions
    Keyboard.dismiss;
    if (textInputContent.length <= 0)
      return;
    sendMessage(textInputContent);
    setTextInputContent('');
  };

  return (
    <SafeAreaView>
      <View style={styles.bottomContainer}>
        <TextInput
          onFocus={onFocus}
          placeholder='Send a message...'
          placeholderTextColor={Colors.lightGrey}
          style={styles.textInput}
          onChangeText={(text) => setTextInputContent(text)}
          value={textInputContent}
          onSubmitEditing={() => onSubmit()}
          onPressOut={() => Keyboard.dismiss}
          returnKeyType='send'
        />
        <TouchableOpacity
          style={styles.sendButton}
          disabled={textInputContent.length === 0}
          onPress={onSubmit}>
          <Ionicons
            name='md-send'
            size={20}
            color={
              textInputContent.length === 0 ? Colors.lightGrey : Colors.grey
            }
          />
        </TouchableOpacity>
        <View style={styles.safeAreaFiller} />
      </View>
    </SafeAreaView>
  );
};

export default SendMessageInput;

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    ...Styles.hardShadows,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    paddingHorizontal: 10,
    flex: 1,
    height: 40,
    backgroundColor: Colors.lighterGrey,
    borderRadius: 10,
    ...Fonts.bold(13, Colors.grey),
  },
  sendButton: {
    height: 40,
    width: 40,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: Colors.lighterGrey,
    ...Styles.center,
  },
  safeAreaFiller: {
    position: 'absolute',
    backgroundColor: 'white',
    bottom: -responsiveHeight(40),
    left: 0,
    right: 0,
    height: responsiveHeight(40),
  },
});
