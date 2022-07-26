import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import useKeyboardVisible from '../hooks/useKeyboardVisible';
import Styles, { Colors, Fonts } from '../styles/Styles';
import ProfileAvatar from './ProfileAvatar';



const ChatHeader = (conversation, otherUserConnected) => {

  const isKeyboardVisible = useKeyboardVisible();

  return (
    <View style={styles.container}>
      {isKeyboardVisible === false ? (
        <View style={styles.headerContainerKeyboard}>
          <ProfileAvatar
            size={100}
            showStatusDot={true}
            isUserOnline={otherUserConnected}
          />
          <Text style={{ ...Fonts.bold(22, Colors.darkGrey), marginTop: 10 }}>
            {conversation?.user?.displayName}
          </Text>
          <Text style={{ ...Fonts.bold(13, Colors.lightGrey), marginTop: 5 }}>
            {conversation?.user?.displayName}
          </Text>
        </View>
      ) : (
        <SafeAreaView style={styles.headerContainer}>
          <View style={styles.userinfos}>
            <Text style={styles.username}>
              {conversation?.user?.displayName}
            </Text>
            <View style={{ ...styles.statusDot, backgroundColor: otherUserConnected ? Colors.green : Colors.lightGrey }}/>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};

export default ChatHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    alignItems: 'center',
    height: 200,
  },
  headerContainerKeyboard: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...Styles.hardShadows,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...Styles.hardShadows,
    ...Styles.safeAreaView,
  },
  userinfos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  username: {
    ...Fonts.bold(20, Colors.darkGrey),
  },
  statusDot: {
    ...Styles.blueShadow,
    width: 12,
    height: 12,
    borderRadius: 16,
    marginLeft: 10,
  },
});
