import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Colors } from '../styles/Styles';

import FooterConfirmation from '../components/FooterConfirmation';
import GoBackHeader from '../components/GoBackHeader';
import DropyMediaViewer from '../components/DropyMediaViewer';
import useOverlay from '../hooks/useOverlay';
import { blockUser, reportUser } from '../utils/profiles';
import useCurrentUser from '../hooks/useCurrentUser';
import useConversationsSocket from '../hooks/useConversationsSocket';

const DisplayDropyMediaScreen = ({ navigation, route }) => {
  const { dropy, showBottoModal } = route.params || {};

  const { user } = useCurrentUser();
  const { sendAlert } = useOverlay();
  const { showActionSheetWithOptions } = useActionSheet();
  const { openChat } = useConversationsSocket();

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Report Drop', 'Block user', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: 'Drop',
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        reportUser(dropy.emitter.id, sendAlert, dropy.id);
      } else if (buttonIndex === 1) {
        blockUser(dropy.emitter.id, sendAlert, navigation);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GoBackHeader
        color={Colors.white}
        onPressOptions={user.id === dropy.emitter.id ? undefined : handleOptionsButtonPress}
      />
      <DropyMediaViewer dropy={dropy} />
      {showBottoModal && (
        <FooterConfirmation onPress={() => openChat(dropy.chatConversationId)} dropy={dropy} textButton="Let's chat !" />
      )}
    </SafeAreaView>
  );
};

export default DisplayDropyMediaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
});
