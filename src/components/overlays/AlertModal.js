import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Styles, { Colors, Fonts } from '../../styles/Styles';
import GlassButton from '../GlassButton';


const AlertModal = ({ navigation, title, description }) => {
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Receive notifications while walking onto a drop</Text> */}
        <Text style={styles.title}>{title}</Text>
        <Entypo name="cross" size={24} style={styles.cross} onPress={() => navigation.navigate('Home')} />
        {/* <Text style={styles.description}>Enable background geolocation, finds drop without having the app open</Text> */}
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.laterButton}>
            <Text style={{ ...Fonts.bold(14, Colors.darkGrey), letterSpacing: 4 }}>later</Text>
          </TouchableOpacity>
          <GlassButton onPress={() => navigation.navigate('Chat')} buttonText={'turn on'} disabled={false} style={styles.turnonButton} fontSize={14}>
          </GlassButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...Styles.center,
  },
  container: {
    position: 'absolute',
    height: 300,
    backgroundColor: Colors.white,
    borderRadius: 25,
    width:300,
    ...Styles.hardShadows,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cross: {
    color: Colors.lightGrey,
    position: 'absolute',
    top: '5%',
    right: '3%',
  },
  title: {
    ...Fonts.bold(14, Colors.purple1),
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  description: {
    ...Fonts.bold(12, Colors.grey),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around' },
  laterButton: {
    height: 50,
    borderRadius: 25,
    ...Styles.center,
    paddingHorizontal: 10,
  },
  turnonButton: {
    height: 50,
    borderRadius: 25,
    ...Styles.hardShadows,
    ...Styles.center,
    paddingHorizontal: 10,
  },
});

export default AlertModal;
