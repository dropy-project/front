import React from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions } from 'react-native';
import Styles from '../styles/Styles';
import HomeScreenTabBar from '../components/HomeScreenTabBar';
import Map from '../assets/svgs/map';

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView}>
        <Map height={Dimensions.get('window').height} width={Dimensions.get('window').width} />
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
  }
});
