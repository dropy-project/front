import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { MaterialIcons } from '@expo/vector-icons';

import ConversationItem from '../components/chat/ConversationItem';
import FadeInWrapper from '../components/effect/FadeInWrapper';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import GoBackHeader from '../components/other/GoBackHeader';
import GlassButton from '../components/input/GlassButton';

import useConversationsSocket from '../hooks/useConversationsSocket';
import useOverlay from '../hooks/useOverlay';
import Styles, { Colors, Fonts } from '../styles/Styles';


const ConversationsScreen = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  const {
    loading,
    conversations,
    closeConversation,
    markConversationAsRead,
    listConversations,
  } = useConversationsSocket();

  useEffect(() => {
    listConversations();
  }, []);

  const handleLongPress = async (conversation) => {
    const confirmed = await sendAlert({
      title: 'Fermer la conversation',
      description: `Es-tu sûr·e de fermer ta conversation avec ${conversation.user.displayName} ?`,
      validateText: 'Fermer',
    });

    if (confirmed === true) {
      const result = await closeConversation(conversation.id);
      console.log('Conversation closed', result);
    }
  };

  const openConversation = (conversation) => {
    markConversationAsRead(conversation.id);
    navigation.navigate('Chat', { conversation });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader
        onPressGoBack={() => navigation.navigate('Home')}
        text={'Mes conversations'}
      />
      {loading ? (
        <LoadingSpinner selfCenter />
      ) : (
        <FlatList
          data={conversations}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, height: responsiveHeight(80), ...Styles.center }}>
              <MaterialIcons name='location-on' size={58} color={Colors.darkGrey} />
              <Text style={styles.text}>Trouve un drop pour commencer une nouvelle conversation.</Text>
              <GlassButton buttonText='Retour' style={styles.backButton} onPress={() => navigation.goBack()} fontSize={17} />
            </View>
          )}
          renderItem={({ item: conversation, index }) => (
            <FadeInWrapper key={conversation.id} delay={index * 50}>
              <ConversationItem
                conversation={conversation}
                onLongPress={() => handleLongPress(conversation)}
                onPress={() => openConversation(conversation)}
                {...conversation}
              />
            </FadeInWrapper>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: {
    ...Styles.safeAreaView,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    width: '100%',
    paddingVertical: 20,
  },
  text: {
    ...Fonts.ligth(15, Colors.darkGrey),
    textAlign: 'center',
    marginTop: 30,
    width: '80%',
  },
  backButton: {
    top: 90,
    ...Styles.hardShadows,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
});
