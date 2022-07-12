import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Text, View } from 'react-native';
import ConversationItem from '../components/ConversationItem';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import useConversationSocket from '../hooks/useConversationSocket';
import Styles, { Colors, Fonts } from '../styles/Styles';

const ConversationsScreen = ({ navigation }) => {

  const { conversations } = useConversationSocket();

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader
        onPressGoBack={() => navigation.navigate('Home')}
        text={'My conversations'}
      />
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
                onPress={() => navigation.navigate('Chat', { conversation })}
                {...conversation}
              />
            </FadeInWrapper>
          ))}
        </ScrollView>
      )}
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
