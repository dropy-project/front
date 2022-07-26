


const chatHeader = () => {

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
              {conversation?.user?.displaName}
            </Text>
            <Text style={{ ...Fonts.bold(13, Colors.lightGrey), marginTop: 5 }}>
              {conversation?.user?.displayName}
            </Text>
          </View>
        ) : (
          <SafeAreaView style={styles.headerContainer}>
            <View style={styles.userinfos}>
              <Text style={styles.username}>
                {conversation.user.displayName}
              </Text>
              <View style={{ ...styles.statusDot, backgroundColor: otherUserConnected ? Colors.green : Colors.lightGrey }}/>
            </View>
          </SafeAreaView>
        </View>
        )}
    );
}

export default chatHeader;