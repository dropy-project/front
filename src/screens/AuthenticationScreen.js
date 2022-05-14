import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, SafeAreaView } from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { Colors, Fonts } from '../styles/Styles';
import LargeRectangleButton from '../components/LargeRectangleButton';
import Svg1 from '../assets/svgs/background_auth_1.svg';
import Svg2 from '../assets/svgs/background_auth_2.svg';
import Svg3 from '../assets/svgs/background_auth_3.svg';

const AuthenticationScreen = ({ navigation }) => {
  const [name, setNameValue] = useState('');

  return (
    <View style={styles.container}>
      <View>
        <Svg2 height={500} width={450} style={{ ...styles.svg }} />
        <Svg1 height={400} width={250} style={{ ...styles.svg }} />
        <Svg3 height={400} width={400} style={{ ...styles.svg }} />
      </View>
      <SafeAreaView style={styles.content} >
        <Text style={{ ...Fonts.bold(50, Colors.white) }}>Dropy</Text>
        <TextInput onChange={(text) => setNameValue(text)} style={{ ...Fonts.bold(15, Colors.purple5), ...styles.textInput }} placeholder="What's your name ?" placeholderTextColor={Colors.purple5} />
        <LargeRectangleButton disabled={name.length === 0} style={styles.largeButton} buttonText={'start'} onPress={() => navigation.navigate('Home')} />
      </SafeAreaView>
    </View>
  )
};

export default AuthenticationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  textInput: {
    marginBottom: responsiveHeight(20),
    width: 267,
    height: 45,
    borderRadius: 14,
    padding: 15,
    backgroundColor: Colors.lighterGrey
  },
  largeButton: {
    position: 'absolute',
    bottom: responsiveHeight(7),
    width: 228,
    height: 57
  },
  svg: {
    position: 'absolute'
  }
});
