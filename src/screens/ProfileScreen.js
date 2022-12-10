import React, { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import DebugText from '../components/other/DebugText';
import ProfileScreenHeader, { MAX_HEADER_HEIGHT } from '../components/profile/ProfileScreenHeader';
import useCurrentUser from '../hooks/useCurrentUser';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import { Colors, Fonts } from '../styles/Styles';
import { sinceDayMonth } from '../utils/time';

const ProfileScreen = ({ route, navigation }) => {
  const { userId: externalUserId, conversation = null } = route.params ?? { userId: null, conversation: null };

  const { user, setUser } = useCurrentUser();
  const { sendAlert } = useOverlay();

  const [displayedUser, setDisplayedUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (externalUserId == null)
      setDisplayedUser(user);
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (externalUserId != null) {
        const response = await API.getProfile(externalUserId);
        setDisplayedUser(response.data);
      } else if (user != null) {
        setDisplayedUser(user);
        const response = await API.getProfile(user.id);
        setDisplayedUser(response.data);
        setUser(response.data);
      }
    } catch (error) {
      sendAlert({
        title: 'Patatra !',
        description: 'Impossible de récupérer les informations du profil.\nVérifie ta connexion internet',
      });
      console.error('Error while fetching profile informations', error?.response?.data || error);
      navigation.goBack();
    }
  };

  const scrollAnimValue = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnimValue } } }],
          { useNativeDriver: true })
        }
        indicatorStyle='black'
      >
        <View style={styles.infoContainer}>
          <Text style={{ ...Fonts.regular(13, Colors.lightGrey) }}>À propos</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>{displayedUser?.about ?? `Salut, moi c'est ${displayedUser?.displayName}`}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={{ ...Fonts.regular(13, Colors.lightGrey) }}>Stats</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Member since
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${sinceDayMonth(displayedUser?.registerDate)}`}
            </Text>
          </Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Drops:
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${displayedUser?.emittedDropiesCount}`}
            </Text>
          </Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Found:
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${displayedUser?.retrievedDropiesCount}`}
            </Text>
          </Text>
        </View>
        <DebugText marginBottom={200}>{JSON.stringify(displayedUser, null, 2)}</DebugText>
      </Animated.ScrollView>

      <ProfileScreenHeader
        conversation={conversation}
        showControls={externalUserId == null}
        user={displayedUser}
        scrollAnimValue={scrollAnimValue}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollViewContent: {
    paddingTop: MAX_HEADER_HEIGHT,
    height: responsiveHeight(130),
  },
  infoContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 30,
  },
});
