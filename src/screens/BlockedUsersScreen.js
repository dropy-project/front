import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import FadeInWrapper from '../components/FadeInWrapper';
import GoBackHeader from '../components/GoBackHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileAvatar from '../components/ProfileAvatar';
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
        title: 'Oh no...',
        description: 'We couldn\'t load this...\nCheck your internet connection!',
      });
      console.error('Error while fetching blocked users', error?.response?.data || error);
      navigation.goBack();
    }
  };

  const unblockUser = async (userId) => {
    const confirmed = await sendAlert({
      title: 'Are you sure?',
      description: 'This user will be unblocked!',
      denyText: 'Cancel',
      validateText: 'Unblock',
    });

    if (!confirmed) {
      return;
    }

    try {
      const response = await API.unblockUser(userId);
      console.log('Unblock API response', response.data);
      setBlockedUsers(old => old.filter((user) => user.id !== userId));
    } catch (error) {
      sendAlert({
        title: 'Oh no...',
        description: 'We couldn\'t unblock this user...\nCheck your internet connection!',
      });
      console.error('Error while unblocking user', error?.response?.data || error);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <GoBackHeader text="Blocked users" />
      {loading ? (
        <View style={{ height: responsiveHeight(80), ...Styles.center }}>
          <LoadingSpinner />
        </View>
      ) : (
        <ScrollView indicatorStyle='black' showsVerticalScrollIndicator contentContainerStyle={styles.scrollViewContent}>
          {blockedUsers.length === 0 && (
            <View style={{ height: responsiveHeight(80), ...Styles.center }}>
              <Text style={{ ...Fonts.regular(13, Colors.darkGrey) }}>{'You don\'t have blocked anyone yet'}</Text>
            </View>
          )}
          {blockedUsers.map((user, index) => (
            <FadeInWrapper key={user.id} delay={index * 50}>
              <View style={styles.userContainer}>
                <ProfileAvatar userId={user.id} />
                <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                  <Text style={{ ...Fonts.bold(14, Colors.darkGrey) }}>{user.displayName}</Text>
                  <Text style={{ ...Fonts.regular(10, Colors.darkGrey), marginTop: 5 }}>@{user.username}</Text>
                </View>
                <TouchableOpacity onPress={() => unblockUser(user.id)}>
                  <Feather name="unlock" size={24} color={Colors.red} />
                </TouchableOpacity>
              </View>
            </FadeInWrapper>
          ))}
        </ScrollView>
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
