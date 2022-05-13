import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  Button
} from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import Svg1 from '../assets/svgs/background_auth_1.svg';
import Svg2 from '../assets/svgs/background_auth_2.svg';
import Svg3 from '../assets/svgs/background_auth_3.svg';

const AuthenticationScreen = ({ navigation }) => {
  return (

    <View style={styles.container}>
      <View>
        <Svg1 height={400} width={250} style={{ ...styles.svg }} />
        <Svg2 height={500} width={450} style={{ ...styles.svg }} />
        <Svg3 height={400} width={400} style={{ ...styles.svg }} />
      </View>
      <SafeAreaView style={styles.content} >
        <Text style={{ ...Fonts.bold(50, Colors.white) }}>Dropy</Text>
        <TextInput style={{ ...Fonts.bold(15, Colors.purple5), ...styles.textInput }} placeholder="What's your name ?" placeholderTextColor={Colors.purple5} />
        <Button title="Learn More"
          color="#841584"></Button>
      </SafeAreaView>
    </View>
  );
};

export default AuthenticationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  textInput: {
    width: 267,
    height: 45,
    borderRadius: 14,
    padding: 15,
    backgroundColor: Colors.lighterGrey
  },
  svg: {
    position: 'absolute'
  }
});
