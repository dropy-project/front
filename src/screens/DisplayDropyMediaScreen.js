import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Colors } from '../styles/Styles';

import FooterConfirmation from '../components/FooterConfirmation';
import GoBackHeader from '../components/GoBackHeader';
import DropyMediaViewer from '../components/DropyMediaViewer';
import useOverlay from '../hooks/useOverlay';
import useConversationSocket from '../hooks/useConversationSocket';

const DisplayDropyMediaScreen = ({ navigation, route }) => {
  const { dropy } = route.params || {};

  const { sendAlert } = useOverlay();
  const { conversations } = useConversationSocket();

  const openChat = async () => {
    try {
      navigation.navigate('Chat', {
        conversation: conversations.find(c => c.id === dropy.conversationId),
      });
    } catch (error) {
      console.log('Open chat error', error?.response?.data ?? error);
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
