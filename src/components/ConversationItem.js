import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileAvatar from './ProfileAvatar';
import DebugText from './DebugText';

const ConversationItem = ({
  conversation,
  user,
  lastMessagePreview,
  lastMessageDate,
  isOnline,
  isRead,
  onPress,
  onLongPress,
}) => {

  const navigation = useNavigation();
  const openProfile = () => {
    navigation.navigate('Profile', { userId: user.id, conversation });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openProfile}>
        <ProfileAvatar
          showStatusDot={true}
          isUserOnline={isOnline}
          userId={user?.id}
          displayName={user?.displayName}
        />
      </TouchableOpacity>
      <TouchableOpacity onLongPress={onLongPress} onPress={onPress} style={styles.infoContainer}>
        <View style={styles.infoTopContainer}>
          <Text style={styles.usernameText}>{user?.displayName}</Text>
          <View style={{ ...styles.timeStampContainer }}>
            <Ionicons
              name="checkmark-done"
              size={17}
              color={isRead ? Colors.mainBlue : Colors.lightGrey}
            />
            <Text style={styles.lastMessageTimeStampText}>
              {lastMessageDate}
            </Text>
          </View>
        </View>
        <Text style={styles.lastMessageText} numberOfLines={1}>
          {lastMessagePreview ?? `Start chatting with ${user?.displayName}`}
        </Text>
      </TouchableOpacity>
      <DebugText showBoundingBox>{JSON.stringify(user, null, 2)}</DebugText>
    </View>
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
