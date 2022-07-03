import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ChatBubble from '../components/ChatBubble';
import GoBackHeader from '../components/GoBackHeader';
import ProfileAvatar from '../components/ProfileAvatar';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ChatScreen = ({ route }) => {
  const { conversation } = route.params;

  const [textInputContent, setTextInputContent] = useState('');

  const sendMessage = () => {
    Keyboard.dismiss;
    console.log(textInputContent);
    setTextInputContent('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ProfileAvatar size={100} showStatusDot={true} isUserOnline={false} />
        <Text style={{ ...Fonts.bold(22, Colors.darkGrey), marginTop: 10 }}>
          {conversation?.user?.username}
        </Text>
        <Text style={{ ...Fonts.bold(13, Colors.lightGrey), marginTop: 5 }}>
          Met x hours ago
        </Text>
      </View>

      <SafeAreaView
        style={{
          position: 'absolute',
          width: '100%',
          flex: 1,
        }}>
        <GoBackHeader onPressOptions={() => {}} />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}>
          <ChatBubble
            isLeft
            content={'Salut ça va ?'}
            read={true}
            timestamp={'10h23'}
          />
          <ChatBubble
            content={
              'How wow, ça fais longtemps que je l\'ai posé, bien et toi ?'
            }
            read={false}
            timestamp={'10h24'}
          />
        </KeyboardAvoidingView>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.bottomContainer}>
          <TextInput
            placeholder="Send a message..."
            placeholderTextColor={Colors.lightGrey}
            style={styles.textInput}
            onChangeText={text => setTextInputContent(text)}
            value={textInputContent}
            onEndEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendButton}
            disabled={textInputContent.length === 0}
            onPress={sendMessage}>
            <Ionicons
              name="md-send"
              size={20}
              color={
                textInputContent.length === 0 ? Colors.lightGrey : Colors.grey
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...Styles.hardShadows,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    ...Styles.hardShadows,
    padding: 30,
    paddingBottom: 80,
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
});
