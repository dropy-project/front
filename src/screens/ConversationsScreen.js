import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ConversationItem from '../components/ConversationItem';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';

const ConversationsScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);

  const { sendAlert } = useOverlay();

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    try {
      const result = await API.getConversations();
      setConversations(result.data);
    } catch (error) {
      console.log(error?.response?.data ?? error);
      sendAlert({
        title: 'Oh that\'s bad...',
        description: 'Looks like we can\'t load your conversations right now...',
      });
    }
  };

  const deleteConversation = async (id) => {
    const deleteConfirmed = sendAlert({
      title: 'Delete this conversation',
      description: 'Are you sure you want to delete this conversation?\n This cannot be undone.',
      denyText: 'Cancel',
      confirmText: 'Delete',
    });
    if(deleteConfirmed) {
      // TO DO: Delete conversation
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader
        onPressGoBack={() => navigation.navigate('Home')}
        text={'My conversations'}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {conversations.map((conversation, index) => (
          <FadeInWrapper key={conversation.id} delay={index * 50}>
            <ConversationItem
              onPress={() => navigation.navigate('Chat', { conversation })}
              onLongPress={() => deleteConversation(conversation.id)}
              {...conversation}
            />
          </FadeInWrapper>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
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
