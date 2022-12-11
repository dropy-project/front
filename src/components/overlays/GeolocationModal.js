import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import DropyLogo from '../../assets/svgs/dropy_logo.svg';
import GlassButton from '../GlassButton';


const GeolocationModal = () => (
  <View style={styles.container}>
    <View style={styles.mainContent}>
      <DropyLogo height={87} width={87} />
      <Text style={styles.title}>{'La géolocalisation est désactivée !'}</Text>
      <Text style={styles.description}>{'Nous devons savoir où tu te trouves pour te montrer les drops à proximité !'}</Text>
    </View>
    <GlassButton onPress={() => Linking.openSettings()} buttonText={'Ouvrir les paramètres'} disabled={false} style={styles.openSettingsButton} fontSize={14}>
    </GlassButton>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    ...Styles.center,
  },
  mainContent: {
    position: 'absolute',
    height: 300,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    ...Fonts.bold(16, Colors.purple1),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  description: {
    ...Fonts.bold(14, Colors.grey),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  openSettingsButton: {
    height: 50,
    position: 'absolute',
    bottom: '5%',
    width: '90%',
    borderRadius: 25,
    ...Styles.hardShadows,
    ...Styles.center,
    paddingHorizontal: 10,
  },
});

export default GeolocationModal;
