import React from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Styles, { Colors, Fonts } from '../styles/Styles';
import useOverlay from '../hooks/useOverlay';
import { blockUser, PRONOUNS, reportUser } from '../utils/profiles';
import ProfileImage from './ProfileImage';
import TouchableTooltip from './TouchableTooltip';

export const MAX_HEADER_HEIGHT = responsiveHeight(45);
export const MIN_HEADER_HEIGHT = responsiveHeight(24);

const ProfileScreenHeader = ({ externalUserId, user, scrollAnimValue, showControls = false, conversation }) => {

  const { showActionSheetWithOptions } = useActionSheet();
  const { sendAlert } = useOverlay();

  const navigation = useNavigation();

  const headerTranform = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT],
    outputRange: [0, -MIN_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerCancelTransform = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT],
    outputRange: [0, MIN_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const editOpacity = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT / 2, MIN_HEADER_HEIGHT - 20],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const dropsOpacity = scrollAnimValue.interpolate({
    inputRange: [0, MIN_HEADER_HEIGHT / 4, MIN_HEADER_HEIGHT / 2],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const handleOptionsButtonPress = () => {
    showActionSheetWithOptions({
      options: ['Report user', 'Block user', 'Cancel'],
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      title: `@${user?.username}`,
    }, (buttonIndex) => {
      if (buttonIndex === 0) {
        reportUser(user.id, sendAlert);
      } else if (buttonIndex === 1) {
        blockUser(user.id, sendAlert, navigation);
      }
    });
  };

  return (
    <Animated.View style={{ ...styles.animatedHeader, transform: [{ translateY: headerTranform }] }}>

      <Animated.View style={{ ...StyleSheet.absoluteFillObject, transform: [{ translateY: headerCancelTransform }] }}>
        <ProfileImage displayNameSize={40} displayName={user?.displayName} userId={externalUserId} />
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          start={{ x: 0.5, y: 0.7 }}
          end={{ x: 0.6, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <LinearGradient
        colors={['rgba(123, 109, 205, 0)', 'rgba(117, 90, 190, 1)']}
        start={{ x: 0.5, y: 0.6 }}
        end={{ x: 0.4, y: 1.3 }}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={Styles.safeAreaView}>
        <Animated.View style={{ ...styles.headerControlsContainer, transform: [{ translateY: headerCancelTransform }] }}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="arrow-left" size={30} color={Colors.white} />
          </TouchableOpacity>
          {showControls ? (
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="settings" size={24} color={Colors.white} />
              </TouchableOpacity>

              <Animated.View style={{ opacity: editOpacity }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileEdit')}
                  style={{ marginTop: 20 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="edit" size={24} color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ opacity: dropsOpacity }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('UserDropies')}
                  style={{ marginTop: 22 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialCommunityIcons name="tooltip-image-outline" size={26}  color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          ) : (
            <View>
              <TouchableOpacity onPress={handleOptionsButtonPress}>
                <Feather name="more-horizontal" size={30} color={Colors.white} />
              </TouchableOpacity>
              {conversation != null && (
                <Animated.View style={{ opacity: editOpacity }}>
                  <TouchableOpacity onPress={() => {
                    navigation.goBack();
                    navigation.navigate('Chat', { conversation });
                  }}
                  style={{ position: 'absolute', top: '100%', paddingTop: 25 }}>
                    <Ionicons
                      name="md-chatbubble-outline"
                      size={30}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          )}
        </Animated.View>
      </SafeAreaView>

      <View style={styles.headerUserInfosContainer}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ ...Fonts.bold(25, Colors.white) }}>{user?.displayName}</Text>
            <RankIcons user={user} />
          </View>
          <Text style={{ ...Fonts.regular(13, Colors.white) }}>@{user?.username}</Text>
        </View>
        {user?.pronouns !== 'UNKOWN' && (
          <Text style={{ ...Fonts.regular(13, Colors.white) }}>{PRONOUNS[user?.pronouns]}</Text>
        )}
      </View>
    </Animated.View>
  );
};

export default ProfileScreenHeader;

const RankIcons = ({ user }) => {
  if(!user) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {user.isDeveloper && (
        <TouchableTooltip style={{ marginLeft: 7 }} tooltipText="Developer">
          <MaterialCommunityIcons name="code-braces-box" size={25}  color="#c299ff" />
        </TouchableTooltip>
      )}
      {user.isAdmin && (
        <TouchableTooltip style={{ marginLeft: 7 }} tooltipText="Admin">
          <FontAwesome5 name="shield-alt" size={19} color="#aeb9fc" />
        </TouchableTooltip>
      )}
      {user.isAmbassador && (
        <TouchableTooltip style={{ marginLeft: 7 }} tooltipText="Ambassador">
          <Octicons name="code-of-conduct" size={20} color="#f571c0" />
        </TouchableTooltip>
      )}
      {user.isPremium && (
        <TouchableTooltip style={{ marginLeft: 7 }} tooltipText="Premium">
          <FontAwesome5 name="crown" size={18} color="#faec84" />
        </TouchableTooltip>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MAX_HEADER_HEIGHT,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  headerControlsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerUserInfosContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
});
