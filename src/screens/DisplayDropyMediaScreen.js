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

const DisplayDropyMediaScreen = ({ navigation, route }) => {
  const { dropy, showBottoModal } = route.params || {};

  const { user } = useCurrentUser();
  const { sendAlert } = useOverlay();
  const { showActionSheetWithOptions } = useActionSheet();

  const openChat = async () => {
    try {
      navigation.goBack();
      navigation.navigate('Conversations', { conversationId: dropy.conversationId });
    } catch (error) {
      console.log('Open chat error', error?.response?.data ?? error);
      sendAlert({
        title: 'Oh that\'s bad...',
        description: 'Looks like we can\'t load your conversations right now...',
      });
    }
  };

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Report Drop', 'Block user', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: 'Drop',
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        reportUser(dropy.emitterId, sendAlert, dropy.id);
      } else if (buttonIndex === 1) {
        blockUser(dropy.emitterId, sendAlert, navigation);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <GoBackHeader
        color={Colors.white}
        onPressOptions={user.id === dropy.emitterId ? undefined : handleOptionsButtonPress}
      />
      <DropyMediaViewer {...dropy} />
      {showBottoModal && (
        <FooterConfirmation onPress={openChat} dropy={dropy} textButton="Let's chat !" />
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
