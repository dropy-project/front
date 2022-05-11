import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';

const ChatScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Dropy chat</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require('../assets/icons/left-arrow.png')}
          style={styles.arrow}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'blue',
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0
  },
  arrow: {
    width: 30,
    height: 30
  }
});
