import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo , AntDesign } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';


const OverlayProvider = ({ navigation }) => {
  return (

    <View style={styles.container}>
      <Entypo name="cross" size={24} style={styles.cross} onPress={() => navigation.navigate('Home')} />
      <AntDesign style={styles.warning}name="warning" size={70} color="white" />
      <Text style={styles.title}>Oups, we could not send this dropy into outer space...</Text>
      <Text style={styles.subTitle}>{'We\'ll try again when your internet connexion get better'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.purple2,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: '100%',
    ...Styles.hardShadows,
    ...Styles.center,
  },
  cross: {
    color: Colors.white,
    position: 'absolute',
    top: '5%',
    right: '3%',
  },
  warning: {
    color: Colors.white,
    position: 'absolute',
    top: '10%',
  },
  title: {
    ...Fonts.bold(16, Colors.white),
    textAlign: 'center',
    marginTop: 100,
    paddingHorizontal: 10,
  },
  subTitle: {
    ...Fonts.regular(13, Colors.lighterGrey),
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default OverlayProvider;
