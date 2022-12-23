import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import GoBackHeader from '../components/other/GoBackHeader';
import useOverlay from '../hooks/useOverlay';
import API from '../services/API';
import Styles, { Colors, Fonts } from '../styles/Styles';

const AccountScreen = ({ navigation }) => {
  const { sendAlert } = useOverlay();


  const handleDeleteAccount = async () => {
    const confirmed = await sendAlert({
      title: 'Attention !',
      description: 'Ton compte et toutes tes données seront définitivement supprimés.',
      denyText: 'Annuler',
      validateText: 'Supprimer',
    });

    if (!confirmed)
      return;

    try {
      const response = await API.deleteAccount();
      await BackgroundGeolocation.stop();
      console.log(response.data);
      await API.logout();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Splash',
            params: { cancelAutoLogin: true },
          }
        ],
      });
    } catch (error) {
      sendAlert({
        title: 'Erreur',
        description: 'Le serveur est injoignable...\nVérifie ta connexion internet',
      });
      console.error('Error while deleting user', error?.response?.data || error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader text='Mon compte' />
      <View style={styles.content}>
        <TouchableOpacity style={{ ...styles.navigateContainer, marginTop: 10 }} disabled>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>Abonnement</Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateContainer} disabled>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>Restaurer les achats</Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navigateContainer} onPress={() => navigation.navigate('ResetPasswordScreen')}>
          <Text style={{ ...Fonts.bold(12, Colors.darkGrey) }}>Changer mon mot de passe</Text>
          <View style={styles.navigateArrow}>
            <AntDesign name='arrowright' size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />
      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={{ ...Fonts.regular(12, Colors.lightGrey) }}>Supprimer mon compte</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    ...Styles.safeAreaView,
  },
  content: {
    width: responsiveWidth(100),
    alignItems: 'center',
    marginTop: 20,
    height: '80%',
  },
  navigateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lighterGrey,
    width: '90%',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    ...Styles.softShadows,
    shadowOpacity: 0.2,
    height: 50,
    marginBottom: 10,
  },
  navigateArrow: {
    ...Styles.center,
    backgroundColor: Colors.darkGrey,
    height: '95%',
    width: 50,
    borderRadius: 12,
  },
  spacer: {
    width: '90%',
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.lighterGrey,
    marginVertical: 20,
  },
});
