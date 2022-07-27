import React from 'react';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, Text, View , TouchableOpacity } from 'react-native';
import useKeyboardVisible from '../hooks/useKeyboardVisible';
import Styles, { Colors, Fonts } from '../styles/Styles';
import GoBackHeader from './GoBackHeader';
import ProfileAvatar from './ProfileAvatar';



const ChatHeader = ({ conversation, otherUserConnected }) => {

  const isKeyboardVisible = useKeyboardVisible();

  return (
    <View style={{ ...styles.container, height: isKeyboardVisible ? 50 : undefined }}>
      <GoBackHeader />
      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-horizontal" size={40} color={Colors.grey}/>
      </TouchableOpacity>
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
            Met x hours ago
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
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Styles.hardShadows,
  },
  headerContainerKeyboard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: 5,
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
  moreButton: {
    position: 'absolute',
    right: 20,
  },
});
