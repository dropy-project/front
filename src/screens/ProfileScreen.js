import React, { useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import ProfileScreenHeader, { MAX_HEADER_HEIGHT } from '../components/ProfileScreenHeader';
import useCurrentUser from '../hooks/useCurrentUser';
import API from '../services/API';
import { Colors, Fonts } from '../styles/Styles';
import { sinceDayMonth } from '../utils/time';

const ProfileScreen = ({ route }) => {

  const { userId: externalUserId } = route.params ?? { userId: null };
  const { user: localUser } = useCurrentUser();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if(externalUserId != null) {
      API.getProfile(externalUserId).then(response => {
        setUser(response.data);
      });
    }
    setUser(localUser);
  }, [localUser]);

  const scrollAnimValue = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollAnimValue } } }],
          { useNativeDriver: true })
        }
      >
        <View style={styles.infoContainer}>
          <Text style={{ ...Fonts.regular(13, Colors.lightGrey) }}>About</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>{user?.about ?? `Hello i'm ${user?.displayName}`}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={{ ...Fonts.regular(13, Colors.lightGrey) }}>Records</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Member since
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${sinceDayMonth(user?.registerDate)}`}
            </Text>
          </Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Drops:
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${user?.emittedDropiesCount}`}
            </Text>
          </Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>
            Found:
            <Text style={{ ...Fonts.bold(13, Colors.darkGrey), marginTop: 5 }}>
              {` ${user?.retrievedDropiesCount}`}
            </Text>
          </Text>
        </View>
      </Animated.ScrollView>

      <ProfileScreenHeader
        externalUserId={externalUserId}
        showControls={externalUserId == null}
        user={user}
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
    minHeight: '100%',
  },
  infoContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 30,
  },
});
