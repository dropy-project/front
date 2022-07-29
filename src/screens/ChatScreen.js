import React, { useRef } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import LoadingSpinner from '../components/LoadingSpinner';
import useChatSocket from '../hooks/useChatSocket';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import useKeyboardVisible from '../hooks/useKeyboardVisible';

import SendMessageInput from '../components/SendMessageInput';
import ChatBubble from '../components/ChatBubble';
import ChatHeader from '../components/ChatHeader';

const ONE_HOUR = 60 * 60 * 1000;

const ChatScreen = ({ route, navigation }) => {
  const { conversation } = route.params;

  const flatListRef = useRef(null);

  const { sendAlert } = useOverlay();
  const { user } = useCurrentUser();

  const {
    messages,
    sendMessage,
    otherUserConnected,
    loadMoreMessages,
  } = useChatSocket(conversation.id, handleSocketError);

  async function handleSocketError() {
    await sendAlert({
      title: 'An error occurred',
      description: 'Check your internet connection and try again',
    });
    navigation.goBack();
  }

  useKeyboardVisible(() => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  });

  const renderChatMessage = ({ item: message, index }) => {
    const isLastMessage = index === 0;
    const nextMessage = messages[index - 1];
    const hourDifference = Math.abs(new Date(message.date) - new Date(nextMessage?.date)) / ONE_HOUR;
    return (
      <ChatBubble
        {...message}
        key={message.id}
        isChunkFirstMessage={hourDifference > 2}
        animationDelay={index * 10}
        isLeft={message?.sender.id !== user.id}
        showDate={isLastMessage}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ChatHeader conversation={conversation} otherUserConnected={otherUserConnected}/>
      <FlatList
        ref={flatListRef}
        style={styles.chatList}
        contentContainerStyle={{ paddingVertical: 30 }}
        data={messages}
        renderItem={renderChatMessage}
        inverted
        indicatorStyle='black'
        ListEmptyComponent={<LoadingSpinner selfCenter/>}
        onEndReached={loadMoreMessages}
      />
      <SendMessageInput sendMessage={sendMessage}/>
      {Platform.OS === 'ios' && (
        <KeyboardSpacer />
      )}
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
  chatList: {
    flex: 1,
    width: '100%',
  },
});
