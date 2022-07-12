import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import ProfileAvatar from '../components/ProfileAvatar';
import useChatSocket from '../hooks/useChatSocket';
import useCurrentUser from '../hooks/useCurrentUser';
import Styles, { Colors, Fonts } from '../styles/Styles';
import useKeyboardVisible from '../hooks/useKeyboardVisible';

const ChatScreen = ({ route }) => {
  const { conversation } = route.params;
  const [textInputContent, setTextInputContent] = useState('');

  const scrollViewRef = useRef();

  const { user } = useCurrentUser();

  const [lastMessagesCount, setLastMessagesCount] = useState(0);
  const { messages, sendMessage, otherUserConnected } = useChatSocket(conversation.id);

  const isKeyboardVisible = useKeyboardVisible();

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: messages.length - lastMessagesCount < 10 });
    setLastMessagesCount(messages.length);
  }, [messages]);

  const onSubmit = () => {
    Keyboard.dismiss;
    if(textInputContent.length <= 0) return;
    sendMessage(textInputContent);
    setTextInputContent('');
  };

  return (
    <View style={styles.container}>
      {isKeyboardVisible === true ? (
        <View style={styles.headerContainerKeyboard}>
          <ProfileAvatar
            size={100}
            showStatusDot={true}
            isUserOnline={otherUserConnected}
          />
          <Text style={{ ...Fonts.bold(22, Colors.darkGrey), marginTop: 10 }}>
            {conversation?.user?.displaName}
          </Text>
          <Text style={{ ...Fonts.bold(13, Colors.lightGrey), marginTop: 5 }}>
            {conversation?.user?.displayName}
          </Text>
        </View>
      ) : (
        <View style={styles.headerContainer}>
          <View style={styles.userinfos}>
            <Text style={styles.username}>
              {conversation.user.displayName}
            </Text>
            <View style={{ ...styles.statusDot, backgroundColor: otherUserConnected ? Colors.green : Colors.lightGrey }}/>
          </View>
        </View>
      )}

      <SafeAreaView
        style={{
          position: 'absolute',
          width: '100%',
          flex: 1,
        }}>
        <GoBackHeader onPressOptions={() => {}} />
      </SafeAreaView>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {messages.slice(0, messages.length - 20).map((message) => (
          <ChatBubble key={message.id} isLeft={message.sender.id !== user.id} {...message} />
        ))}
        {messages.slice(messages.length - 20).map((message, index) => (
          <FadeInWrapper key={message.id} delay={index * 50}>
            <ChatBubble isLeft={message.sender.id !== user.id} {...message} />
          </FadeInWrapper>
        ))}
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
            onEndEditing={onSubmit}
            returnKeyType="send"
            onFocus={() => scrollViewRef.current.scrollToEnd()}
          />
          <TouchableOpacity
            style={styles.sendButton}
            disabled={textInputContent.length === 0}
            onPress={onSubmit}>
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
  headerContainerKeyboard: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...Styles.hardShadows,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...Styles.hardShadows,
  },
  userinfos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    width: '15%',
  },
  username: {
    ...Fonts.bold(20, Colors.darkGrey),
  },
  statusDot: {
    ...Styles.blueShadow,
    width: 12,
    height: 12,
    borderRadius: 16,
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
