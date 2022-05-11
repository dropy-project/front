import React from 'react';
import { StyleSheet, TouchableOpacity, Alert, View } from 'react-native';
import { AntDesign , FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Styles from '../styles/Styles';
import GlassCircle from './GlassCircleButton';


const HomeScreenTabBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Museum')}>
        <FontAwesome name="bank" size={30} color="black" />
      </TouchableOpacity>
      <GlassCircle onPress={() => Alert.alert('Je me suis fait touché')}>
        <FontAwesome5 name="plus" size={20} color="white" />
      </GlassCircle>
      <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        <AntDesign name="wechat" size={30} color="black" />
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

