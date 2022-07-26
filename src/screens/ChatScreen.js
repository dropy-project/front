import React, { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { chunckHeaderTimeString } from '../utils/time';

import useChatSocket from '../hooks/useChatSocket';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import useKeyboardVisible from '../hooks/useKeyboardVisible';

import SendMessageInput from '../components/SendMessageInput';
import ChatBubble from '../components/ChatBubble';
import { Colors, Fonts } from '../styles/Styles';

const ONE_HOUR = 60 * 60 * 1000;

const ChatScreen = ({ route, navigation }) => {
  const { conversation } = route.params;

  const flatListRef = useRef(null);

  const { sendAlert } = useOverlay();
  const { user } = useCurrentUser();

  const {
    messages,
    sendMessage,
  } = useChatSocket(conversation.id, handleSocketError);

  async function handleSocketError() {
    await sendAlert({
      title: 'An error occurred',
      description: 'Check your internet connection and try again',
    });
    navigation.goBack();
  }

  useKeyboardVisible(() => {
    // to do scroll en bas (scollToEnd fait l'inverse de ça)
  });

  const renderChatMessage = ({ item: message, index }) => {
    const isLastMessage = index === 0;
    const nextMessage = messages[index + 1];
    const hourDifference = Math.abs(new Date(message.date) - new Date(nextMessage?.date)) / ONE_HOUR;
    if( hourDifference > 2 ) {
      return (
        <React.Fragment key={message.id}>
          <ChatBubble
            {...message}
            index={0}
            animateIn={true}
            isLeft={message.sender.id !== user.id}
            showDate={isLastMessage}
          />
          <Text style={styles.chunckHeader}>{chunckHeaderTimeString(nextMessage.date)}</Text>
        </React.Fragment>
      );
    }
    return (
      <ChatBubble
        {...message}
        key={message.id}
        index={0}
        animateIn={true}
        isLeft={message?.sender.id !== user.id}
        showDate={isLastMessage}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderChatMessage}
        contentContainerStyle={{ paddingVertical: 30 }}
        inverted={true}
      />
      <SendMessageInput sendMessage={sendMessage}/>
      <KeyboardSpacer />
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
  chunckHeader: {
    ...Fonts.bold(13, Colors.lightGrey),
    marginTop: 30,
    marginBottom: 5,
    textAlign: 'center',
  },
});
