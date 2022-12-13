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
      <SimpleLineIcons name='key' size={74} color={Colors.purple1} />
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
    </View>
    <Text>Un lien permettant de créer ton nouveau mot de passe te sera ensuite envoyé sur ton adresse email.</Text>
    <GlassButton buttonText='Envoyer' style={styles.backButton} onPress={() => navigation.goBack()} fontSize={17} />
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
    marginTop: 20,
    height: '80%',
  },
});
