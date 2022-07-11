import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import ConversationItem from '../components/ConversationItem';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import useConversationSocket from '../hooks/useConversationSocket';

const ConversationsScreen = ({ navigation }) => {

  const { conversations } = useConversationSocket();

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
