import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileAvatar from './ProfileAvatar';

const Conversation = ({ username, lastMessagePreview,lastMessageTimeStamp, isOnline, isRead }) => {
  return (
    <View style={{ ...styles.container }}>
      <View>
        <ProfileAvatar showStatusDot={true} isUserOnline ={isOnline} pictureSRC = {require('../assets/icons/Tomm.png')} />
      </View>
      <View style={{ ...styles.infoContainer }}>
        <Text style={styles.usernameText}> {username}</Text>
        <Text style={styles.lastMessageText}> {lastMessagePreview}</Text>
      </View>
      <View style={{ ...styles.timeStampContainer }}>
        <Ionicons name="checkmark-done" size={20} color={isRead ? Colors.mainBlue : Colors.black} />
        <Text style={styles.lastMessageTimeStampText}> {lastMessageTimeStamp}</Text>
      </View>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    ...Styles.center,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  usernameText: {
    ...Fonts.bold(20, 'black'),
    marginBottom: 10,
  },
  infoContainer: {
    width: 200,
    textAlign: 'left',
    overflow: 'hidden',
  },
  timeStampContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
