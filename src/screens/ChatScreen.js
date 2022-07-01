import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Conversation from '../components/Conversation';
import GoBackHeader from '../components/GoBackHeader';
import API from '../services/API';

const ChatScreen = ({ navigation }) => {

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    const result = await API.getConversations();
    console.log(result.data);
    setConversations(result.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} text={'My conversations'}/>
      <ScrollView>
        {conversations.map(conversation => (
          <Conversation key= {conversation.id} username={conversation.user.username} lastMessagePreview = {conversation.lastMessagePreview} lastMessageTimeStamp = {conversation.lastMessageDate} isOnline = {conversation.isOnline} isRead = {conversation.isRead}/>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
