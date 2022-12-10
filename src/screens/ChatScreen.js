import React, { useRef } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import useChatSocket from '../hooks/useChatSocket';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import useKeyboardVisible from '../hooks/useKeyboardVisible';
import ChatBubble from '../components/chat/ChatBubble';
import SendMessageInput from '../components/input/SendMessageInput';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import ChatHeader from '../components/chat/ChatHeader';


const ONE_HOUR = 60 * 60 * 1000;

const ChatScreen = ({ route, navigation }) => {
  const { conversation, popToTopOnQuit = false } = route.params;

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
      title: 'Il y a eu un problème...',
      description: 'Vérifie ta connexion internet et réessaye.',
    });
    navigation.goBack();
  }

  useKeyboardVisible(() => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  });

  const renderChatMessage = ({ item: message, index }) => {
    const isLastMessage = index === 0;
    const nextMessage = messages[index + 1];
    const hourDifference = Math.round(Math.abs(new Date(message.date) - new Date(nextMessage?.date)) / ONE_HOUR);
    return (
      <ChatBubble
        {...message}
        key={message.id}
        isChunkFirstMessage={hourDifference > 2}
        animationDelay={index * 10}
        isLeft={message?.sender.id !== user.id}
        showDate={isLastMessage}
        hourDifference={hourDifference}
      />
    );
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && (
        <KeyboardSpacer />
      )}
      <SendMessageInput sendMessage={sendMessage}/>
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
      <ChatHeader
        popToTopOnQuit={popToTopOnQuit}
        conversation={conversation}
        otherUserConnected={otherUserConnected}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },
  chatList: {
    flex: 1,
    width: '100%',
  },
});
