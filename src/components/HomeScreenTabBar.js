import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { AntDesign , FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Styles from '../styles/Styles';

const HomeScreenTabBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Museum')}>
        <AntDesign name="wechat" size={30} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome name="bank" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenTabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 100,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    ...Styles.hardShadows
  }
});

