import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileAvatar from './ProfileAvatar';

const ConversationItem = ({
  user,
  lastMessagePreview,
  lastMessageTimeStamp,
  isOnline,
  isRead,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onLongPress={onLongPress} onPress={onPress}>
      <ProfileAvatar
        showStatusDot={true}
        isUserOnline={isOnline}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoTopContainer}>
          <Text style={styles.usernameText}>{user?.displayName}</Text>
          <View style={{ ...styles.timeStampContainer }}>
            <Ionicons
              name="checkmark-done"
              size={17}
              color={isRead ? Colors.mainBlue : Colors.lightGrey}
            />
            <Text style={styles.lastMessageTimeStampText}>
              {lastMessageTimeStamp ?? '10:20'}
            </Text>
          </View>
        </View>
        <Text style={styles.lastMessageText}>
          {lastMessagePreview ?? `Send a message to ${user?.displayName}`}
        </Text>
      </View>

    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...Styles.center,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 20,
  },
  infoContainer: {
    width: 200,
    flex: 1,
    textAlign: 'left',
    overflow: 'hidden',
    paddingLeft: 20,
  },
  infoTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  usernameText: {
    ...Fonts.bold(20, 'black'),
  },
  timeStampContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageTimeStampText: {
    ...Fonts.bold(11, Colors.lightGrey),
    marginLeft: 3,
  },
  lastMessageText: {
    ...Fonts.bold(14, Colors.lightGrey),
  },
});
