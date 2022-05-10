import React from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView } from 'react-native';
import Styles from '../styles/Styles';
import HomeScreenTabBar from '../components/HomeScreenTabBar';

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.text}>Dropy Home</Text>
        <Button
          title="Je suis le bouton"
          onPress={() => Alert.alert('Je me suis fait cliqué !')}
        />
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
  text: {
    color: 'blue',
    fontSize: 20
  }
});
