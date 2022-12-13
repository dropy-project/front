import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { SimpleLineIcons } from '@expo/vector-icons';
import GoBackHeader from '../components/other/GoBackHeader';
import Styles, { Colors } from '../styles/Styles';
import FormInput from '../components/input/FormInput';
import GlassButton from '../components/input/GlassButton';

const ResetPassword = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <GoBackHeader text='Reset Password' />
    <View style={styles.content}>
      <View style={styles.icon}>
        <SimpleLineIcons name='key' size={74} color={Colors.purple1} />
      </View>
      <View style={styles.formBox}>
        <Text>Réinitialiser son mot de passe</Text>
        <FormInput
        //ref={emailInputRef}
        //onEdited={setEmail}
          placeholder='Email'
          inputStyle={{ backgroundColor: Colors.lighterGrey }}
          isEmail
          //defaultValue={email}
          autoComplete='email'
        />
        <Text>Un lien permettant de créer ton nouveau mot de passe te sera ensuite envoyé sur ton adresse email.</Text>
        <GlassButton buttonText='Envoyer' style={styles.backButton} onPress={() => navigation.goBack()} fontSize={17} />
      </View>
    </View>
  </SafeAreaView>
);

export default ResetPassword;

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
    justifyContent: 'space-between',
    marginTop: 20,
    height: '90%',
    backgroundColor: Colors.lightGrey,
  },
  icon: {
    backgroundColor: Colors.red,
  },
  formBox: {
    justifyContent: 'space-between',
    width: '80%',
    height: '60%',
    margin: 30,
    backgroundColor: Colors.green,
  },
});
