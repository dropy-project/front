import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { MaterialIcons } from '@expo/vector-icons';

import ConversationItem from '../components/chat/ConversationItem';
import FadeInWrapper from '../components/effect/FadeInWrapper';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import GoBackHeader from '../components/other/GoBackHeader';
import GlassButton from '../components/input/GlassButton';

import useConversationsSocket from '../hooks/useConversationsSocket';
import useOverlay from '../hooks/useOverlay';
import Styles, { Colors, Fonts } from '../styles/Styles';


const ConversationsScreen = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  const {
    loading,
    conversations,
    closeConversation,
    markConversationAsRead,
    listConversations,
  } = useConversationsSocket();

  useEffect(() => {
    listConversations();
  }, []);

  const handleLongPress = async (conversation) => {
    const confirmed = await sendAlert({
      title: 'Close conversation',
      description: `Are you sure you want to close the conversation with ${conversation.user.displayName}?`,
      validateText: 'delete',
    });

    if (confirmed === true) {
      const result = await closeConversation(conversation.id);
      console.log('Conversation closed', result);
    }
  };

  const openConversation = (conversation) => {
    markConversationAsRead(conversation.id);
    navigation.navigate('Chat', { conversation });
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
        <FlatList
          data={conversations}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, height: responsiveHeight(80), ...Styles.center }}>
              <MaterialIcons name='location-on' size={58} color='grey' />
              <Text style={{ ...Fonts.ligth(15, Colors.grey), textAlign: 'center', marginTop: 30 }}>Find drops, begin new conversations!</Text>
              <GlassButton buttonText='Back' style={styles.backButton} onPress={() => navigation.navigate('Home')} fontSize={17} />
            </View>
          )}
          renderItem={({ item: conversation, index }) => (
            <FadeInWrapper key={conversation.id} delay={index * 50}>
              <ConversationItem
                conversation={conversation}
                onLongPress={() => handleLongPress(conversation)}
                onPress={() => openConversation(conversation)}
                {...conversation}
              />
            </FadeInWrapper>
          )}
        />
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
  backButton: {
    bottom: -230,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 60,
    paddingRight: 60,
    borderRadius: 24,
  },
});
