import React from 'react';
import { StyleSheet, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import Conversation from '../components/Conversation';
import GoBackHeader from '../components/GoBackHeader';

const ChatScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={() => navigation.navigate('Home')} text={'My conversations'}/>
      <ScrollView>
        <Conversation />
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
