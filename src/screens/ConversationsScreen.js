import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import ConversationItem from '../components/ConversationItem';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import LoadingSpinner from '../components/LoadingSpinner';
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
              <Text style={{ ...Fonts.ligth(15, Colors.grey), textAlign: 'center' }}>Find drops, begin new conversations!</Text>
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
});
