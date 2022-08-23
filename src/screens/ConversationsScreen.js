import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';
import ConversationItem from '../components/ConversationItem';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import useConversationSocket from '../hooks/useConversationSocket';
import useOverlay from '../hooks/useOverlay';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ConversationsScreen = ({ navigation, route }) => {

  const { conversationId = null } = route.params || {};
  const { sendAlert } = useOverlay();
  const { loading, conversations, closeConversation } = useConversationSocket(handleSocketError);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if(conversations == null || conversations.length === 0) return;
    if(initialized) return;

    if(conversationId != null) {
      const toOpenConversation = conversations.find(conversation => conversation.id === conversationId);
      if(toOpenConversation != null) {
        navigation.navigate('Chat', { conversation: toOpenConversation  });
      }
    }

    setInitialized(true);
  }, [conversations]);

  async function handleSocketError() {
    await sendAlert({
      title: 'An error occurred',
      description: 'Check your internet connection and try again',
    });
    navigation.goBack();
  }

  const handleLongPress = async (conversation) => {
    const confirmed = await sendAlert({
      title: 'Close conversation',
      description: `Are you sure you want to close the conversation with ${conversation.user.displayName}?`,
      validateText: 'delete',
    });

    if(confirmed === true) {
      const result = await closeConversation(conversation.id);
      console.log('Conversation closed', result);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader
        onPressGoBack={() => navigation.navigate('Home')}
        text={'My conversations'}
      />
      {loading ? (
        <LoadingSpinner selfCenter />
      ) : (
        <>
          {conversations.length === 0 ? (
            <View style={{ flex: 1, ...Styles.center }}>
              <Text style={{ ...Fonts.ligth(15, Colors.grey), textAlign: 'center' }}>Find drops, begin new conversations!</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}>
              {conversations.map((conversation, index) => (
                <FadeInWrapper key={conversation.id} delay={index * 50}>
                  <ConversationItem
                    conversation={conversation}
                    onLongPress={() => handleLongPress(conversation)}
                    onPress={() => navigation.navigate('Chat', { conversation })}
                    {...conversation}
                  />
                </FadeInWrapper>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    ...Styles.safeAreaView,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    width: '100%',
    paddingVertical: 20,
  },
});
