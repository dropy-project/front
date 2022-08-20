import React, { useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import ProfileScreenHeader, { MAX_HEADER_HEIGHT } from '../components/ProfileScreenHeader';
import { Colors, Fonts } from '../styles/Styles';

const ProfileScreen = () => {

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
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>Je mange des truites la nuit car le soleil attire aux travers du sl les fourmis</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={{ ...Fonts.regular(13, Colors.lightGrey) }}>Records</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>Member since 2008</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>Drops: 208</Text>
          <Text style={{ ...Fonts.regular(13, Colors.darkGrey), marginTop: 5 }}>Found: 11</Text>
        </View>
      </Animated.ScrollView>

      <ProfileScreenHeader scrollAnimValue={scrollAnimValue} />
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
