import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FooterConfirmation from '../components/FooterConfirmation';
import GoBackHeader from '../components/GoBackHeader';

import { Colors } from '../styles/Styles';
import DropyMediaViewer from '../components/DropyMediaViewer';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import { messageTimeString } from '../utils/time';

const DisplayDropyMediaScreen = ({ navigation, route }) => {
  const { dropy } = route.params || {};

  const { sendAlert } = useOverlay();

  const getConversations = async () => {
    const result = await API.getConversations();

    const datedConversations = result.data.map((conversation) => ({
      ...conversation,
      lastMessageDate: messageTimeString(conversation.lastMessageDate),
    }));

    return datedConversations;
  };

  const openChat = async () => {
    try {
      const convs = await getConversations();
      navigation.navigate('Chat', { conversation: convs.find(c => c.id === dropy.conversationId) });
    } catch (error) {
      console.log(error?.response?.data ?? error);
      sendAlert({
        title: 'Oh that\'s bad...',
        description: 'Looks like we can\'t load your conversations right now...',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} />
      <DropyMediaViewer {...dropy} />
      <FooterConfirmation onPress={openChat} dropy={dropy} textButton="Let's chat !" />
    </SafeAreaView>
  );
};

export default DisplayDropyMediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
});
