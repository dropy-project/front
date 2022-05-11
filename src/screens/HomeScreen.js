import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import HomeScreenTabBar from '../components/HomeScreenTabBar';
import Map from '../assets/svgs/map';

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Map style={StyleSheet.absoluteFillObject} width={'100%'} />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.textContainer}>
          <Text style={{ ...Fonts.ligth(18, Colors.primary) }}>Je suis un texte light</Text>
          <Text style={{ ...Fonts.regular() }}>Je suis un texte regular</Text>
          <Text style={{ ...Fonts.bold() }}>Je suis un texte bold</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={{ ...Fonts.bold(18, Colors.mainBlue) }}>Je suis un texte bleu et bold</Text>
        </View>
      </SafeAreaView>
      <HomeScreenTabBar />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Styles.center,
    ...Styles.hardShadows
  },
  safeAreaView: {
    flex: 1,
    ...Styles.center
  },
  textContainer: {
    ...Styles.center,
    ...Styles.hardShadows,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});
