import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../styles/Styles';

import { blockUser, reportUser } from '../utils/profiles';

import useOverlay from '../hooks/useOverlay';
import useCurrentUser from '../hooks/useCurrentUser';
import useConversationsSocket from '../hooks/useConversationsSocket';

import DropyMediaViewer from '../components/other/DropyMediaViewer';
import GoBackHeader from '../components/other/GoBackHeader';
import FooterConfirmation from '../components/other/FooterConfirmation';

const DisplayDropyMediaScreen = ({ navigation, route }) => {
  const { dropy, showBottoModal } = route.params || {};

  const { user } = useCurrentUser();
  const { sendAlert } = useOverlay();
  const { showActionSheetWithOptions } = useActionSheet();
  const { createConversation } = useConversationsSocket();

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Report Drop', 'Block user', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: 'Drop',
    }, (buttonIndex) => {
      if (buttonIndex === 0)
        reportUser(dropy.emitter.id, sendAlert, dropy.id);
      else if (buttonIndex === 1)
        blockUser(dropy.emitter.id, sendAlert, navigation);
    });
  };

  const openConversation = async () => {
    try {
      const conversation = await createConversation(dropy.id);
      navigation.navigate('Chat', { conversation, popToTopOnQuit: true });
    } catch (error) {
      console.error('error while creating conversation', error);
    }
  };


  // Ask confirmation before go back (leave drop)
  const handleGoBack = async () => {

    const result = await sendAlert({
      title: 'Are you sure?',
      description: 'If you go back, you will no longer\n be able to open the drop!\nAre you sure you want to go back?',
      validateText: 'Stay',
      denyText: 'Go back',
    });

    !result && navigation.goBack();

  };


  return (
    <SafeAreaView style={styles.container}>
      <DropyMediaViewer dropy={dropy} style={{ ...StyleSheet.absoluteFillObject }} />
      <LinearGradient
        colors={['rgba(10,0,10,0.7)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.2 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents='none'
      />
      <StatusBar barStyle='light-content' />
      <GoBackHeader
        color={Colors.white}
        onPressOptions={user.id === dropy.emitter.id ? undefined : handleOptionsButtonPress}
        onPressGoBack={handleGoBack}
      />
      {showBottoModal && ( //showBottomModal maybe ?
        <FooterConfirmation onPress={openConversation} dropy={dropy} textButton="Let's chat !" />
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
