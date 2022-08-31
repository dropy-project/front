import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
  onPress,
  onLongPress,
  unreadMessagesCount = 0,
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.usernameText}>{user?.displayName}</Text>
            {unreadMessagesCount > 0 && (
              <View style={styles.unreadMessagesCountContainer}>
                <Text style={{ ...Fonts.bold(13, Colors.white) }}>
                  {unreadMessagesCount}
                </Text>
              </View>
            )}
          </View>
          <View style={{ ...styles.timeStampContainer }}>
            <Text style={styles.lastMessageTimeStampText}>
              {lastMessageDate}
            </Text>
          </View>
        </View>
        <Text style={Fonts.bold(13, Colors.lightGrey)} numberOfLines={1}>
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
    ...Fonts.bold(17, Colors.darkGrey),
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
  unreadMessagesCountContainer: {
    backgroundColor: Colors.lightGrey,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    minWidth: 25,
    marginLeft: 10,
    ...Styles.center,
  },
});
