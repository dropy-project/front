import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import { blockUser, reportUser } from '../../utils/profiles';

import useOverlay from '../../hooks/useOverlay';

import ProfileAvatar from '../profile/ProfileAvatar';
import DisabledNotificationsPopup from '../overlays/DisabledNotificationsPopup';

const ChatHeader = ({ conversation, otherUserConnected, popToTopOnQuit }) => {
  const navigation = useNavigation();
  const { sendAlert } = useOverlay();
  const { showActionSheetWithOptions } = useActionSheet();

  const openProfile = () => {
    navigation.navigate('Profile', { userId: conversation.user.id });
  };

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Signaler', 'Bloquer ', 'Annuler'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: conversation?.user?.displayName,
    }, (buttonIndex) => {
      if (buttonIndex === 0)
        reportUser(conversation?.user?.id, sendAlert);
      else if (buttonIndex === 1)
        blockUser(conversation?.user?.id, sendAlert, navigation);
    });
  };

  const handleQuit = () => {
    if (popToTopOnQuit)
      navigation.popToTop();
    else
      navigation.goBack();
  };

  return (
    <SafeAreaView style={{ ...Styles.safeAreaView, ...styles.safeArea }}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleQuit}
          style={styles.button}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name='arrow-left' size={30} color={Colors.grey} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfosContainer} onPress={openProfile}>
          <ProfileAvatar
            avatarUrl={conversation?.user?.avatarUrl}
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
          <Feather name='more-horizontal' size={30} color={Colors.grey} />
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
