import React from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import GoBackHeader from '../components/GoBackHeader';
import DropyLogo from '../assets/svgs/dropy_logo.svg';
import { Colors, Fonts } from '../styles/Styles';

const GetDropyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader onPressGoBack={ () => navigation.navigate('Home')}/>
      <View style={styles.containerImage}>
        <Text style={styles.topText}>{'You\'ve juste found'}</Text>
        <DropyLogo height={87} width={87}/>
        <Text style={styles.bottomText}>A new Drop</Text>
        <View style={styles.largeCircle}/>
        <View style={styles.largerCircle}/>
        <View style={styles.bigCircle}/>
      </View>
      <View style={styles.mediumCircle}/>
      <View style={styles.littlerCircle}/>
      <View style={styles.littleCircle}/>
      <View style={styles.circle}/>
    </SafeAreaView>
  );
};

export default GetDropyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  containerImage: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    ...Fonts.regular(18, Colors.darkGrey),
    marginBottom: 30,
  },
  bottomText: {
    ...Fonts.bold(18, '#7B6DCD'),
    marginTop: 30,
  },
  mediumCircle: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 14,
    height: 14,
    left: 25,
    top: 298,
    borderRadius: 7,
  },
  littlerCircle: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 8,
    height: 8,
    left: 321,
    top: 361,
    borderRadius: 10,
  },
  littleCircle: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 10,
    height: 10,
    left: 176,
    top: 146,
    borderRadius: 10,
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#94B2DE',
    width: 14,
    height: 14,
    left: 293,
    top: 527,
    borderRadius: 7,
  },
  largeCircle: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#94B2DE',
    borderStyle: 'solid',
  },
  largerCircle: {
    position: 'absolute',
    width: 613,
    height: 613,
    borderRadius: 500,
    borderWidth: 6,
    borderColor: '#dac9f2',
    borderStyle: 'solid',
  },
  bigCircle: {
    position: 'absolute',
    width: 647,
    height: 647,
    borderRadius: 500,
    borderWidth: 9,
    borderColor: '#b48eff',
    borderStyle: 'solid',
  },
});
