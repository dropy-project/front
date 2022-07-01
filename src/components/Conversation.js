import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileAvatar from './ProfileAvatar';

const Conversation = ({ username = 'Tomm', lastMessagePreview = 'J\'ai 2 m à Tomm car on m\'ai...',lastMessageTimeStamp = '13:12', isOnline = true, isRead = true }) => {
  return (
    <View style={{ ...styles.container }}>
      <ProfileAvatar/>
      <Text style={styles.usernameText}> {username}</Text>
      <Text style={styles.lastMessageText}> {lastMessagePreview}</Text>
      <Text style={styles.lastMessageTimeStampText}> {lastMessageTimeStamp}</Text>
      <Ionicons name="checkmark-done" size={20} color={isRead ? Colors.mainBlue : Colors.black} />
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Styles.center,
  },
  usernameText: {
    ...Fonts.bold(20, 'black'),
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
