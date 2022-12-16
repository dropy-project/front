import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

import FadeInWrapper from '../components/effect/FadeInWrapper';
import LoadingSpinner from '../components/effect/LoadingSpinner';
import GoBackHeader from '../components/other/GoBackHeader';
import ProfileAvatar from '../components/profile/ProfileAvatar';

import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const BlockedUsersScreen = ({ navigation }) => {
  const { sendAlert } = useOverlay();

  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    try {
      setLoading(true);
      const response = await API.getBlockedUsers();
      setBlockedUsers(response.data);
      setLoading(false);
    } catch (error) {
      sendAlert({
        title: 'Mince...',
        description: 'Les utilisateurs bloqués n\'ont pas pu être chargés...\nVérifie ta connexion internet',
      });
      console.error('Error while fetching blocked users', error?.response?.data || error);
      navigation.goBack();
    }
  };

  const unblockUser = async (userId) => {
    const confirmed = await sendAlert({
      title: 'Attention !',
      description: 'Cet utilisateur ne sera plus bloqué et pourra te contacter à nouveau.',
      denyText: 'Annuler',
      validateText: 'Débloquer',
    });

    if (!confirmed)
      return;


    try {
      const response = await API.unblockUser(userId);
      console.log('Unblock API response', response.data);
      setBlockedUsers((old) => old.filter((user) => user.id !== userId));
    } catch (error) {
      sendAlert({
        title: 'Zut...',
        description: 'L\'utilisateur n\'a pas pu être débloqué...\nVérifie ta connexion internet',
      });
      console.error('Error while unblocking user', error?.response?.data || error);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <GoBackHeader text='Utilisateurs bloqués' />
      {loading ? (
        <View style={{ height: responsiveHeight(80), ...Styles.center }}>
          <LoadingSpinner />
        </View>
      ) : (
        <FlatList
          indicatorStyle='black'
          data={blockedUsers}
          showsVerticalScrollIndicator
          contentContainerStyle={styles.scrollViewContent}
          ListEmptyComponent={() => (
            <View style={{ height: responsiveHeight(80), ...Styles.center }}>
              <Text style={{ ...Fonts.regular(13, Colors.darkGrey) }}>{'Tout va pour le mieux dans le meilleur des mondes !'}</Text>
            </View>
          )}
          renderItem={({ item: user, index }) => (
            <FadeInWrapper key={user.id} delay={index * 50}>
              <View style={styles.userContainer}>
                <ProfileAvatar avatarUrl={user.avatarUrl} displayName={user.displayName} />
                <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                  <Text style={{ ...Fonts.bold(14, Colors.darkGrey) }}>{user.displayName}</Text>
                  <Text style={{ ...Fonts.regular(10, Colors.darkGrey), marginTop: 5 }}>@{user.username}</Text>
                </View>
                <TouchableOpacity onPress={() => unblockUser(user.id)}>
                  <Feather name='unlock' size={24} color={Colors.red} />
                </TouchableOpacity>
              </View>
            </FadeInWrapper>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default BlockedUsersScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Styles.safeAreaView,
  },
  scrollViewContent: {
    width: responsiveWidth(100),
    alignItems: 'center',
    paddingBottom: 10,
  },
  userContainer: {
    width: responsiveWidth(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingRight: 30,
  },
});
