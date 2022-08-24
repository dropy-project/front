import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Styles, { Colors, Fonts } from '../styles/Styles';
import { blockUser, reportUser } from '../utils/profiles';
import useOverlay from '../hooks/useOverlay';
import ProfileAvatar from './ProfileAvatar';
import DisabledNotificationsPopup from './DisabledNotificationsPopup';

const ChatHeader = ({ conversation, otherUserConnected }) => {

  const navigation = useNavigation();
  const { sendAlert } = useOverlay();
  const { showActionSheetWithOptions } = useActionSheet();

  const openProfile = () => {
    navigation.navigate('Profile', { userId: conversation.user.userId });
  };

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Report user', 'Block user', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: conversation?.user?.displayName,
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        reportUser(conversation?.user?.userId, sendAlert);
      } else if (buttonIndex === 1) {
        blockUser(conversation?.user?.userId, sendAlert, navigation);
      }
    });
  };

  return (
    <SafeAreaView style={{ ...Styles.safeAreaView, ...styles.safeArea }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="arrow-left" size={30} color={Colors.grey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfosContainer} onPress={openProfile}>
          <ProfileAvatar
            userId={conversation?.user?.userId}
            displayName={conversation?.user?.displayName}
            displayNameSize={10}
            size={40}
            showStatusDot
            style={{ borderWidth: 0 }}
            statusDotStyle={{ borderWidth: 2, bottom: 1, right: 1, width: 13, height: 13 }}
            isUserOnline={otherUserConnected}
          />
          <Text style={{ ...Fonts.bold(15, Colors.darkGrey), marginHorizontal: 15 }}>
            {conversation?.user?.displayName}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOptionsButtonPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="more-horizontal" size={30} color={Colors.grey} />
        </TouchableOpacity>
      </View>

      <DisabledNotificationsPopup />
    </SafeAreaView>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    ...Styles.hardShadows,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  userInfosContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
