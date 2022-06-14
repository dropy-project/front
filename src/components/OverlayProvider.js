import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo , AntDesign } from '@expo/vector-icons';
import Styles, { Colors, Fonts } from '../styles/Styles';



const OverlayProvider = ({ navigation }) => {
  return (

    <View style={styles.container}>
      <Entypo name="cross" size={24} style={styles.cross} onPress={() => navigation.navigate('Home')} />
      <AntDesign style={styles.warning}name="warning" size={40} color="white" />
      <Text style={styles.title}>Oups, we could not send this dropy into outer space...</Text>
      <Text style={styles.subTitle}>{'We\'ll try again when your internet connexion get better'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.purple6,
    borderRadius: 25,
    width: '100%',
    ...Styles.hardShadows,
    ...Styles.center,
  },
  cross: {
    color: Colors.lighterGrey,
    position: 'absolute',
    top: '5%',
    right: '5%',
  },
  warning: {
    color: Colors.lighterGrey,
    position: 'absolute',
    top: '5%',
  },
  title: {
    ...Fonts.bold(18, Colors.lighterGrey),
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  subTitle: {
    ...Fonts.regular(14, Colors.lighterGrey),
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default OverlayProvider;
