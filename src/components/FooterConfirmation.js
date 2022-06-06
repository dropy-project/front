import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import Styles, { Colors, Fonts } from '../styles/Styles';
import YouriPicture from '../assets/svgs/youri.svg';
import GlassButton from './GlassButton';


const FooterConfirmation = () => (
  <View style={styles.container}>
    <View style={styles.infoContainer}>
      <View style={styles.pictureContainer}>
        <YouriPicture style={styles.profilePicture} width={65} height={65} />
      </View>
      <View style={styles.infoDropy}>
        <Text style={styles.profileName}>@Youri le bro</Text>
        <Text style={styles.dropyDate}>Droppé ya 40 ans</Text>
      </View>
    </View>
    <GlassButton buttonText={'Open !'} style={{ height: 50 }} />
  </View >
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    backgroundColor: Colors.white,
    borderRadius: 25,
    width: '85%',
    padding: 15,
    ...Styles.hardShadows,
  },
  pictureContainer: {
    borderRadius: 25,
    marginRight: 10,
    ...Styles.softShadows,
    overflow: 'hidden',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingBottom: 15,
  },
  infoDropy: {
    justifyContent: 'center',
  },
  profileName: {
    ...Fonts.bold(20, Colors.darkerGrey),
  },
  dropyDate: {
    ...Fonts.regular(14, Colors.darkGrey),
  },
});

export default FooterConfirmation;
